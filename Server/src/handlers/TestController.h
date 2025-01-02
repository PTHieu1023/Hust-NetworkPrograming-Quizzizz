#ifndef TESTCONTROLLER_H
#define TESTCONTROLLER_H

#include "fcp/core/context.h"
#include "services/TestService.h"

namespace controller::quiz {
    inline void createQuiz(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const std::string title = ctx->getProps("title");
            const std::vector<int> questions = ctx->getProps("questions");

            const int userId = service::auth::verifySession(sessionId);
            const auto quiz = service::test::createTest(userId, title, questions);
            ctx->writeClient(quiz->toJson().dump().c_str());
        } catch (std::exception& e) {
            nlohmann::json response;
            response["err"] =  e.what();
            ctx->writeClient(response.dump().c_str());
        }
    }

    inline void getQuizzes(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int authorId = ctx->getProps("authorId");
            const std::string name = ctx->getProps("name");
            const int count = ctx->getProps("count");
            const int page = ctx->getProps("page");

            const auto tests = service::test::getTests(sessionId, authorId, name, count, page);
            nlohmann::json testsJson = nlohmann::json::array();
            for (const auto& test : tests) {
                testsJson.push_back(test.toListJson());
            }
            ctx->writeClient(testsJson.dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }

    inline void createRoom(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const std::string name = ctx->getProps("name");
            const std::string code = ctx->getProps("code");
            const int testId = ctx->getProps("testId");
            const bool isPractice = ctx->getProps("isPractice");
            const bool isPrivate = ctx->getProps("isPrivate");
            const std::string createdAt = ctx->getProps("createdAt");
            const std::string closedAt = ctx->getProps("closedAt");

            const auto room = service::test::createRoom(sessionId, name, code, testId,
                                                    isPractice, isPrivate, createdAt, closedAt);
            ctx->writeClient(room->toJson().dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }

    inline void getRooms(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int hostId = ctx->getProps("hostId");
            const std::string name = ctx->getProps("name");
            const int count = ctx->getProps("count");
            const int page = ctx->getProps("page");

            const auto rooms = service::test::getRooms(sessionId, hostId, name, count, page);
            nlohmann::json roomsJson = nlohmann::json::array();
            for (const auto& room : rooms) {
                roomsJson.push_back(room.toJson());
            }
            ctx->writeClient(roomsJson.dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }

    inline void deleteRoom(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int roomId = ctx->getProps("roomId");

            service::test::deleteRoom(sessionId, roomId);
            ctx->writeClient(model::test::Response::success(nlohmann::json{{"message", "Room deleted"}}).dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }

    inline void updateRoom(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int roomId = ctx->getProps("roomId");
            const std::string name = ctx->getProps("name");
            const std::string code = ctx->getProps("code");
            const int testId = ctx->getProps("testId");
            const bool isPractice = ctx->getProps("isPractice");
            const bool isPrivate = ctx->getProps("isPrivate");
            const std::string createdAt = ctx->getProps("createdAt");
            const std::string closedAt = ctx->getProps("closedAt");

            const auto room = service::test::updateRoom(sessionId, roomId, name, code,
                                                    testId, isPractice, isPrivate,
                                                    createdAt, closedAt);
            ctx->writeClient(room->toJson().dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }

    inline void joinRoom(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const std::string code = ctx->getProps("code");
            
            const auto room = service::test::joinRoom(sessionId, code);
            auto response = room->toJson();
            response["status"] = "Success";
            ctx->writeClient(response.dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }
    
    inline void getRoomResult(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int roomId = ctx->getProps("roomId");

            const auto results = service::test::getRoomResult(sessionId, roomId);
            nlohmann::json jsonResults = nlohmann::json::array();
            for (const auto& result : results) {
                jsonResults.push_back(result.toJson());
            }
            ctx->writeClient(jsonResults.dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }

    inline void getHistoryResult(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");

            const auto history = service::test::getHistoryResult(sessionId);
            nlohmann::json jsonHistory = nlohmann::json::array();
            for (const auto& result : history) {
                jsonHistory.push_back(result.toJson());
            }
            ctx->writeClient(jsonHistory.dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }
}

#endif