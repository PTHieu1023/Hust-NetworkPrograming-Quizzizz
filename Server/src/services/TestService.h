#ifndef TEST_SERVICE_H
#define TEST_SERVICE_H

#include <memory>
#include <pqxx/pqxx>
#include <vector>
#include <sstream>
#include <chrono>
#include <ctime>
#include <iomanip>

#include "fcp/core/database.h"
#include "models/Test.h"

namespace service::test {
   // Validator helper class
   class Validator {
   public:
       static bool isValidDateTime(const std::string& dt) {
           std::tm tm = {};
           std::istringstream ss(dt);
           ss >> std::get_time(&tm, "%Y-%m-%dT%H:%M:%S");
           return !ss.fail();
       }
       
       static void validateDateTime(const std::string& createdAt, const std::string& closedAt) {
           if (!isValidDateTime(createdAt) || !isValidDateTime(closedAt)) {
               throw std::runtime_error("Invalid datetime format. Use: YYYY-MM-DDThh:mm:ss");
           }
           if (closedAt <= createdAt) {
               throw std::runtime_error("closedAt must be after createdAt");
           }
       }

       static void validateRoomCode(pqxx::work& txn, const std::string& code) {
           const pqxx::result exists = txn.exec_params(
               "SELECT id FROM rooms WHERE code = $1", code
           );
           if (!exists.empty()) {
               throw std::runtime_error("Room code already exists");
           }
       }

       static int validateSession(pqxx::work& txn, const std::string& sessionId) {
           const pqxx::result session = txn.exec_params(
               "SELECT user_id FROM session WHERE session_id = $1", sessionId
           );
           if (session.empty()) throw std::runtime_error("Invalid session");
           return session[0]["user_id"].as<int>();
       }

       static void validateTest(pqxx::work& txn, int testId) {
           const pqxx::result test = txn.exec_params(
               "SELECT id FROM tests WHERE id = $1", testId
           );
           if (test.empty()) throw std::runtime_error("Test not found");
       }
   };

   // CRUD Services
   std::unique_ptr<model::test::Test> createTest(const std::string& sessionId, 
                                               const std::string& name,
                                               const std::vector<std::string>& questions, 
                                               bool isPrivate) {
       auto conn = fcp::DB::getInstance()->getConnection();
       pqxx::work txn(*conn);
       try {
           int authorId = Validator::validateSession(txn, sessionId);

           const pqxx::result result = txn.exec_params(
               "INSERT INTO tests (name, author_id, is_private) VALUES ($1, $2, $3) RETURNING id",
               name, authorId, isPrivate
           );

           int testId = result[0]["id"].as<int>();

           for (const auto& questionId : questions) {
               txn.exec_params(
                   "INSERT INTO test_questions (test_id, question_id) VALUES ($1, $2)",
                   testId, questionId
               );
           }

           txn.commit();

           auto test = std::make_unique<model::test::Test>();
           test->id = testId;
           test->name = name;
           test->questions = questions;
           test->isPrivate = isPrivate;
           test->authorId = authorId;

           return test;
       } catch (...) {
           txn.abort();
           throw;
       }
   }

   std::vector<model::test::Test> getTests(const std::string& sessionId, int authorId,
                                         const std::string& name, int count, int page) {
       auto conn = fcp::DB::getInstance()->getConnection();
       pqxx::work txn(*conn);
       try {
           Validator::validateSession(txn, sessionId);

           std::string query = 
               "SELECT t.id, t.name, t.is_private, t.author_id, array_agg(tq.question_id) as questions "
               "FROM tests t "
               "LEFT JOIN test_questions tq ON t.id = tq.test_id "
               "WHERE 1=1 ";

           if (authorId > 0) {
               query += "AND t.author_id = " + std::to_string(authorId) + " ";
           }
           if (!name.empty()) {
               query += "AND t.name ILIKE '%" + name + "%' ";
           }

           query += "GROUP BY t.id ORDER BY t.created_at DESC "
                   "LIMIT " + std::to_string(count) + " "
                   "OFFSET " + std::to_string((page - 1) * count);

           const pqxx::result result = txn.exec(query);
           std::vector<model::test::Test> tests;

           for (const auto& row : result) {
               model::test::Test test;
               test.id = row["id"].as<int>();
               test.name = row["name"].as<std::string>();
               test.isPrivate = row["is_private"].as<bool>();
               test.authorId = row["author_id"].as<int>();

               if (!row["questions"].is_null()) {
                   std::string questionsStr = row["questions"].as<std::string>();
                   questionsStr = questionsStr.substr(1, questionsStr.length() - 2);
                   std::stringstream ss(questionsStr);
                   std::string item;
                   while (std::getline(ss, item, ',')) {
                       test.questions.push_back(item);
                   }
               }
               tests.push_back(test);
           }

           txn.commit();
           return tests;
       } catch (...) {
           txn.abort();
           throw;
       }
   }

   std::unique_ptr<model::test::Room> createRoom(const std::string& sessionId, 
                                               const std::string& name,
                                               const std::string& code, 
                                               int testId, 
                                               bool isPractice,
                                               bool isPrivate, 
                                               const std::string& createdAt,
                                               const std::string& closedAt) {
       auto conn = fcp::DB::getInstance()->getConnection();
       pqxx::work txn(*conn);
       try {
           Validator::validateDateTime(createdAt, closedAt);
           Validator::validateRoomCode(txn, code);
           Validator::validateTest(txn, testId);

           const pqxx::result session_query = txn.exec_params(
               "SELECT s.user_id, u.username FROM session s "
               "JOIN users u ON s.user_id = u.user_id "
               "WHERE s.session_id = $1",
               sessionId
           );

           if (session_query.empty()) {
               throw std::runtime_error("Invalid session");
           }

           int hostId = session_query[0]["user_id"].as<int>();
           std::string hostName = session_query[0]["username"].as<std::string>();

           const pqxx::result result = txn.exec_params(
               "INSERT INTO rooms (name, code, test_id, host_id, is_practice, is_private, created_at, closed_at) "
               "VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
               name, code, testId, hostId, isPractice, isPrivate, createdAt, closedAt
           );

           txn.commit();

           auto room = std::make_unique<model::test::Room>();
           room->id = result[0]["id"].as<int>();
           room->name = name;
           room->code = code;
           room->testId = testId;
           room->hostId = hostId;
           room->hostName = hostName;
           room->isPractice = isPractice;
           room->isPrivate = isPrivate;
           room->createdAt = createdAt;
           room->closedAt = closedAt;

           return room;
       } catch (...) {
           txn.abort();
           throw;
       }
   }

   std::vector<model::test::Room> getRooms(const std::string& sessionId, int hostId,
                                         const std::string& name, int count, int page) {
       auto conn = fcp::DB::getInstance()->getConnection();
       pqxx::work txn(*conn);
       try {
           Validator::validateSession(txn, sessionId);

           std::string query = 
               "SELECT r.id, r.name, r.code, r.test_id, "
               "r.host_id, u.username as host_name, "
               "r.is_practice, r.is_private, r.created_at, r.closed_at "
               "FROM rooms r "
               "JOIN users u ON r.host_id = u.user_id "
               "WHERE r.closed_at > NOW() ";

           if (hostId > 0) {
               query += "AND r.host_id = " + std::to_string(hostId) + " ";
           }
           if (!name.empty()) {
               query += "AND r.name ILIKE '%" + name + "%' ";
           }

           query += "ORDER BY r.created_at DESC "
                   "LIMIT " + std::to_string(count) + " "
                   "OFFSET " + std::to_string((page - 1) * count);

           const pqxx::result result = txn.exec(query);
           std::vector<model::test::Room> rooms;

           for (const auto& row : result) {
               model::test::Room room;
               room.id = row["id"].as<int>();
               room.name = row["name"].as<std::string>();
               room.code = row["code"].as<std::string>();
               room.testId = row["test_id"].as<int>();
               room.hostId = row["host_id"].as<int>();
               room.hostName = row["host_name"].as<std::string>();
               room.isPractice = row["is_practice"].as<bool>();
               room.isPrivate = row["is_private"].as<bool>();
               room.createdAt = row["created_at"].as<std::string>();
               room.closedAt = row["closed_at"].as<std::string>();
               rooms.push_back(room);
           }

           txn.commit();
           return rooms;
       } catch (...) {
           txn.abort();
           throw;
       }
   }

   void deleteRoom(const std::string& sessionId, int roomId) {
       auto conn = fcp::DB::getInstance()->getConnection();
       pqxx::work txn(*conn);
       try {
           const pqxx::result auth_query = txn.exec_params(
               "SELECT r.id FROM rooms r "
               "JOIN session s ON r.host_id = s.user_id "
               "WHERE s.session_id = $1 AND r.id = $2",
               sessionId, roomId
           );

           if (auth_query.empty()) {
               throw std::runtime_error("Unauthorized to delete room");
           }

           txn.exec_params("DELETE FROM rooms WHERE id = $1", roomId);
           txn.commit();
       } catch (...) {
           txn.abort();
           throw;
       }
   }

   std::unique_ptr<model::test::Room> updateRoom(const std::string& sessionId, 
                                               int roomId,
                                               const std::string& name, 
                                               const std::string& code,
                                               int testId, 
                                               bool isPractice, 
                                               bool isPrivate,
                                               const std::string& createdAt, 
                                               const std::string& closedAt) {
       auto conn = fcp::DB::getInstance()->getConnection();
       pqxx::work txn(*conn);
       try {
           Validator::validateDateTime(createdAt, closedAt);
           Validator::validateTest(txn, testId);

           const pqxx::result auth_query = txn.exec_params(
               "SELECT r.id, r.code, u.user_id, u.username "
               "FROM rooms r "
               "JOIN session s ON r.host_id = s.user_id "
               "JOIN users u ON s.user_id = u.user_id "
               "WHERE s.session_id = $1 AND r.id = $2",
               sessionId, roomId
           );

           if (auth_query.empty()) {
               throw std::runtime_error("Unauthorized to update room");
           }

           if (code != auth_query[0]["code"].as<std::string>()) {
               Validator::validateRoomCode(txn, code);
           }

           txn.exec_params(
               "UPDATE rooms SET name = $1, code = $2, test_id = $3, "
               "is_practice = $4, is_private = $5, created_at = $6, closed_at = $7 "
               "WHERE id = $8",
               name, code, testId, isPractice, isPrivate, createdAt, closedAt, roomId
           );

           txn.commit();

           auto room = std::make_unique<model::test::Room>();
           room->id = roomId;
           room->name = name;
           room->code = code;
           room->testId = testId;
           room->hostId = auth_query[0]["user_id"].as<int>();
           room->hostName = auth_query[0]["username"].as<std::string>();
           room->isPractice = isPractice;
           room->isPrivate = isPrivate;
           room->createdAt = createdAt;
           room->closedAt = closedAt;

           return room;
       } catch (...) {
           txn.abort();
           throw;
       }
   }

   std::unique_ptr<model::test::Room> joinRoom(const std::string& sessionId, 
                                             const std::string& code) {
       auto conn = fcp::DB::getInstance()->getConnection();
       pqxx::work txn(*conn);
       try {
           int userId = Validator::validateSession(txn, sessionId);

           const pqxx::result room_query = txn.exec_params(
               "SELECT r.id, r.name, r.code, r.test_id, "
               "r.host_id, u.username as host_name, "
               "r.is_practice, r.is_private, "
               "r.created_at, r.closed_at "
               "FROM rooms r "
               "JOIN users u ON r.host_id = u.user_id "
               "WHERE r.code = $1 AND r.closed_at > NOW()",
               code
           );

           if (room_query.empty()) {
               throw std::runtime_error("Room not found or closed");
           }

           int participantId;
           const pqxx::result existing = txn.exec_params(
               "SELECT id FROM room_participants WHERE room_id = $1 AND user_id = $2",
               room_query[0]["id"].as<int>(), userId
           );

           if (existing.empty()) {
               const pqxx::result part_result = txn.exec_params(
                   "INSERT INTO room_participants (room_id, user_id) VALUES ($1, $2) RETURNING id",
                   room_query[0]["id"].as<int>(), userId
               );
               participantId = part_result[0]["id"].as<int>();
           } else {
               participantId = existing[0]["id"].as<int>();
           }

           txn.commit();

           auto room = std::make_unique<model::test::Room>();
           room->id = room_query[0]["id"].as<int>();
           room->name = room_query[0]["name"].as<std::string>();
           room->code = room_query[0]["code"].as<std::string>();
           room->testId = room_query[0]["test_id"].as<int>();
           room->hostId = room_query[0]["host_id"].as<int>();
           room->hostName = room_query[0]["host_name"].as<std::string>();
           room->isPractice = room_query[0]["is_practice"].as<bool>();
           room->isPrivate = room_query[0]["is_private"].as<bool>();
           room->createdAt = room_query[0]["created_at"].as<std::string>();
           room->closedAt = room_query[0]["closed_at"].as<std::string>();
           room->participantId = participantId;

           return room;
       } catch (...) {
           txn.abort();
           throw;
       }
   }
}

#endif