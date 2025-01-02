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

namespace service::quiz {
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

       static void validateTest(pqxx::work& txn, int testId) {
           const pqxx::result test = txn.exec_params(
               "SELECT quiz_id FROM quiz WHERE quiz_id = $1", testId
           );
           if (test.empty()) throw std::runtime_error("Test not found");
       }
   };

   // CRUD Services
   std::unique_ptr<model::quiz::Quiz> createQuiz(int userId,
                                               const std::string& name,
                                               const std::vector<int>& questions) {
       try {
           pqxx::work txn(*fcp::DB::getInstance()->getConnection());
           const pqxx::result result = txn.exec_params(
               "INSERT INTO quiz (title, created_by) VALUES ($1, $2) RETURNING quiz_id;",
               name, userId
           );

           int quizId = result[0]["quiz_id"].as<int>();
           for (const auto& questionId : questions) {
               auto quiz_question = txn.exec_params(
                   "INSERT INTO quizquestion (quiz_id, question_id) VALUES ($1, $2)",
                   quizId, questionId
               );
               if (quiz_question.affected_rows() == 0)
                   throw std::runtime_error("Failed to insert question");
           }

           txn.commit();

           auto test = std::make_unique<model::quiz::Quiz>();
           test->id = quizId;
           test->name = name;
           test->authorId = userId;
           return test;
       } catch (const pqxx::sql_error &e){
           throw std::runtime_error("Database error: " + std::string(e.what()));
       }catch (const std::exception &e){
           throw std::runtime_error("Unexpected error: " + std::string(e.what()));
       }
   }

   std::vector<std::shared_ptr<model::quiz::Quiz>> getQuizzes(int userId, int page) {
       try {
           pqxx::work txn(*fcp::DB::getInstance()->getConnection());
           const pqxx::result result = txn.exec_params("SELECT * FROM quiz t WHERE created_by = $1 OFFSET $2 LIMIT 6",
               userId,
               --page * 6);
           std::vector<std::shared_ptr<model::quiz::Quiz>> quizzes;

           for (const auto& row : result) {
              auto quiz = std::make_shared<model::quiz::Quiz>();
               quiz->id = row["quiz_id"].as<int>();
               quiz->name = row["title"].as<std::string>();
               quiz->authorId = userId;
               quizzes.push_back(quiz);
           }
           return quizzes;
       } catch (const pqxx::sql_error &e){
           throw std::runtime_error("Database error: " + std::string(e.what()));
       }catch (const std::exception &e){
           throw std::runtime_error("Unexpected error: " + std::string(e.what()));
       }
   }

   std::unique_ptr<model::quiz::Room> createRoom(const std::string& sessionId,
                                               const std::string& name,
                                               const std::string& code, 
                                               int quizId,
                                               const std::string& openedAt,
                                               const std::string& closedAt) {
       try {
           int userId = auth::verifySession(sessionId);
           pqxx::work txn(*fcp::DB::getInstance()->getConnection());
           const pqxx::result result = txn.exec_params(
               "INSERT INTO room (host_id, quiz_id, start_time, end_time, code, name)"
               "VALUES ($1, $2, $3, $4, $5, $6) RETURNING room_id;",
               userId, quizId, openedAt, closedAt, code, name
           );

           txn.commit();

           auto room = std::make_unique<model::quiz::Room>();
           room->id = result[0]["room_id"].as<int>();
           room->name = name;
           room->code = code;
           room->quizId = quizId;
           room->hostId = userId;
           room->createdAt = openedAt;
           room->closedAt = closedAt;
           return room;
       } catch (const pqxx::sql_error &e){
           throw std::runtime_error("Database error: " + std::string(e.what()));
       }catch (const std::exception &e){
           throw std::runtime_error("Unexpected error: " + std::string(e.what()));
       }
   }

   std::vector<std::shared_ptr<model::quiz::Room>> getRooms(const std::string& name, int page) {
       try {
           pqxx::work txn(*fcp::DB::getInstance()->getConnection());
           std::string query =
               "SELECT r.*, u.username AS host_name "
                "FROM room r LEFT JOIN users u ON u.user_id = r.host_id "
                "WHERE r.end_time > CURRENT_TIMESTAMP and r.name like '%' || coalesce($1, '') || '%' "
                "ORDER by r.room_id OFFSET $2 LIMIT 6";

           const pqxx::result result = txn.exec_params(query, name, --page *6);
           std::vector<std::shared_ptr<model::quiz::Room>> rooms;

           for (const auto& row : result) {
               auto room = std::make_shared<model::quiz::Room>();
               room->id = row["room_id"].as<int>();
               room->name = row["name"].as<std::string>();
               room->code = row["code"].as<std::string>();
               room->quizId = row["quiz_id"].as<int>();
               room->hostId = row["host_id"].as<int>();
               room->hostName = row["host_name"].as<std::string>();
               room->createdAt = row["start_time"].as<std::string>();
               room->closedAt = row["end_time"].as<std::string>();
               rooms.push_back(room);
           }

           return rooms;
       }catch (const pqxx::sql_error &e){
           throw std::runtime_error("Database error: " + std::string(e.what()));
       }catch (const std::exception &e){
           throw std::runtime_error("Unexpected error: " + std::string(e.what()));
       }
   }

   void deleteRoom(const std::string& sessionId, int roomId) {
       try {
           pqxx::work txn(*fcp::DB::getInstance()->getConnection());
           const pqxx::result auth_query = txn.exec_params(
               "SELECT r.room_id FROM room r "
               "JOIN session s ON r.host_id = s.user_id "
               "WHERE s.session_id = $1 AND r.room_id = $2",
               sessionId, roomId
           );

           if (auth_query.empty()) {
               throw std::runtime_error("Unauthorized to delete room");
           }

           txn.exec_params("DELETE FROM room WHERE room_id = $1", roomId);
           txn.commit();
       } catch (const pqxx::sql_error &e){
           throw std::runtime_error("Database error: " + std::string(e.what()));
       }catch (const std::exception &e){
           throw std::runtime_error("Unexpected error: " + std::string(e.what()));
       }
   }

   std::unique_ptr<model::quiz::Room> updateRoom(const std::string& sessionId,
                                               int roomId,
                                               const std::string& name, 
                                               const std::string& code,
                                               int testId,
                                               const std::string& createdAt, 
                                               const std::string& closedAt) {
       try {
           pqxx::work txn(*fcp::DB::getInstance()->getConnection());

           const pqxx::result auth_query = txn.exec_params(
               "SELECT r.room_id, r.code, u.user_id, u.username "
               "FROM room r "
               "JOIN session s ON r.host_id = s.user_id "
               "JOIN users u ON s.user_id = u.user_id "
               "WHERE s.session_id = $1 AND r.room_id = $2",
               sessionId, roomId
           );

           if (auth_query.empty()) {
               throw std::runtime_error("Unauthorized to update room");
           }

           txn.exec_params(
               "UPDATE room SET name = $1, code = $2, quiz_id = $3, start_time = $4, end_time = $5 "
               "WHERE room_id = $6",
               name, code, testId, createdAt, closedAt, roomId
           );

           txn.commit();

           auto room = std::make_unique<model::quiz::Room>();
           room->id = roomId;
           room->name = name;
           room->code = code;
           room->quizId = testId;
           room->hostId = auth_query[0]["user_id"].as<int>();
           room->createdAt = createdAt;
           room->closedAt = closedAt;

           return room;
       } catch (const pqxx::sql_error &e){
           throw std::runtime_error("Database error: " + std::string(e.what()));
       }catch (const std::exception &e){
           throw std::runtime_error("Unexpected error: " + std::string(e.what()));
       }
   }

   std::unique_ptr<model::quiz::Room> joinRoom(const std::string& sessionId,
                                             const std::string& code) {
       try {
           int userId = auth::verifySession(sessionId);

           pqxx::work txn(*fcp::DB::getInstance()->getConnection());

           const pqxx::result room_query = txn.exec_params(
               "SELECT r.*, u.username as host_name "
               "FROM room r JOIN users u ON r.host_id = u.user_id "
               "WHERE r.code = $1",
               code
           );

           if (room_query.empty()) {
               throw std::runtime_error("Room not found or closed");
           }

           int participantId;
           const pqxx::result existing = txn.exec_params(
               "SELECT room_participant_id FROM room_participant WHERE room_id = $1 AND participant_id = $2",
               room_query[0]["room_id"].as<int>(), userId
           );

           if (existing.empty()) {
               const pqxx::result part_result = txn.exec_params(
                   "INSERT INTO room_participant (room_id, participant_id) VALUES ($1, $2) RETURNING room_participant_id",
                   room_query[0]["room_id"].as<int>(), userId
               );
               participantId = part_result[0]["room_participant_id"].as<int>();
           } else {
               participantId = existing[0]["room_participant_id"].as<int>();
           }

           txn.commit();

           auto room = std::make_unique<model::quiz::Room>();
           room->id = room_query[0]["room_id"].as<int>();
           room->name = room_query[0]["name"].as<std::string>();
           room->code = room_query[0]["code"].as<std::string>();
           room->quizId = room_query[0]["quiz_id"].as<int>();
           room->hostId = room_query[0]["host_id"].as<int>();
           room->hostName = room_query[0]["host_name"].as<std::string>();
           room->createdAt = room_query[0]["start_time"].as<std::string>();
           room->closedAt = room_query[0]["end_time"].as<std::string>();
           room->participantId = participantId;

           return room;
       } catch (const pqxx::sql_error &e){
           throw std::runtime_error("Database error: " + std::string(e.what()));
       }catch (const std::exception &e){
           throw std::runtime_error("Unexpected error: " + std::string(e.what()));
       }
   }

    std::vector<model::quiz::RoomResult> getRoomResult(const std::string& sessionId, int roomId, int page) {
        try {
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());
            // Validate session and room access
            const pqxx::result auth_query = txn.exec_params(
                "SELECT r.room_id FROM room r "
                "JOIN room_participant rp ON r.room_id = rp.room_id "
                "JOIN session s ON rp.participant_id = s.user_id "
                "WHERE s.session_id = $1 AND r.room_id = $2",
                sessionId, roomId
            );

            if (auth_query.empty()) {
                throw std::runtime_error("Unauthorized to view room results");
            }

            // Get results for all participants
            const pqxx::result result = txn.exec_params(
                "select r.room_id, u.username, count(*) as result "
                "from room r left join room_participant rp on r.room_id = rp.room_id "
                "left join users u on u.user_id = rp.participant_id "
                "left join participant_answser pa on pa.room_participant_id = rp.room_participant_id "
                "left join question_answer qa on qa.id = pa.answer_id "
                "where r.room_id = $1 and qa.is_true = true "
                "group by r.room_id , u.username offset $2 limit 6",
                roomId, --page * 6
            );

            std::vector<model::quiz::RoomResult> results;
            for (const auto& row : result) {
                model::quiz::RoomResult res;
                res.username = row["username"].as<std::string>();
                res.result = row["result"].is_null() ? 0 : row["result"].as<int>();
                results.push_back(res);
            }

            txn.commit();
            return results;
        } catch (const pqxx::sql_error &e){
            throw std::runtime_error("Database error: " + std::string(e.what()));
        }catch (const std::exception &e){
            throw std::runtime_error("Unexpected error: " + std::string(e.what()));
        }
    }

    std::vector<model::quiz::HistoryResult> getHistoryResult(const std::string& sessionId,int page) {
        try {
            int userId = auth::verifySession(sessionId);
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());
            const pqxx::result result = txn.exec_params(
            "select r.room_id , r.name, count(*) as result "
            "from users u join room_participant rp ON u.user_id = rp.participant_id "
            "join room r on r.room_id  = rp.room_id "
            "join participant_answser pa on pa.room_participant_id = rp.room_participant_id "
            "join question_answer qa ON qa.id = pa.answer_id "
            "where qa.is_true = true and u.user_id = $1 and r.end_time < CURRENT_TIMESTAMP "
            "group by r.room_id , r.name offset $2 limit 6",
                userId, --page * 6
            );

            std::vector<model::quiz::HistoryResult> history;
            for (const auto& row : result) {
                model::quiz::HistoryResult res;
                res.roomId = row["room_id"].as<int>();
                res.roomName = row["name"].as<std::string>();
                res.result = row["result"].is_null() ? 0 : row["result"].as<int>();
                history.push_back(res);
            }

            return history;
        } catch (const pqxx::sql_error &e){
            throw std::runtime_error("Database error: " + std::string(e.what()));
        }catch (const std::exception &e){
            throw std::runtime_error("Unexpected error: " + std::string(e.what()));
        }
    }
}

#endif