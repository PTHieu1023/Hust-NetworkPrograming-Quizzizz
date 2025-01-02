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
            const auto quiz = service::quiz::createQuiz(userId, title, questions);
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
            const int userId = service::auth::verifySession(sessionId);
            const int page = ctx->getProps("page");


            const auto tests = service::quiz::getQuizzes(userId, page);
            nlohmann::json testsJson = nlohmann::json::array();
            for (const auto& test : tests) {
                testsJson.push_back(test->toJson());
            }
            ctx->writeClient(testsJson.dump().c_str());
        } catch (std::exception& e) {
            nlohmann::json response;
            response["err"] =  e.what();
            ctx->writeClient(response.dump().c_str());
        }
    }

    inline void createRoom(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const std::string name = ctx->getProps("name");
            const std::string code = ctx->getProps("code");
            const int testId = ctx->getProps("quizId");
            const std::string createdAt = ctx->getProps("openedAt");
            const std::string closedAt = ctx->getProps("closedAt");

            const auto room = service::quiz::createRoom(sessionId, name, code, testId, createdAt, closedAt);
            ctx->writeClient(room->toJson().dump());
        } catch (std::exception& e) {
            ctx->writeClient(nlohmann::json({{"err", e.what()}}).dump().c_str());
        }
    }

    inline void getRooms(const fcp::Context* ctx) {
        try {
            const std::string name = ctx->getProps("name") == nullptr ? "" : ctx->getProps("name");
            const int page = ctx->getProps("page");

            const auto rooms = service::quiz::getRooms(name, page);
            nlohmann::json roomsJson = nlohmann::json::array();
            for (const auto& room : rooms) {
                roomsJson.push_back(room->toJson());
            }
            ctx->writeClient(roomsJson.dump());
        } catch (std::exception& e) {
            ctx->writeClient(nlohmann::json({{"err", e.what()}}).dump().c_str());
        }
    }

    inline void deleteRoom(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int roomId = ctx->getProps("roomId");

            service::quiz::deleteRoom(sessionId, roomId);
            ctx->writeClient(model::quiz::Response::success(nlohmann::json{{"message", "Room deleted"}}).dump());
        } catch (std::exception& e) {
            ctx->writeClient(nlohmann::json({{"err", e.what()}}).dump().c_str());
        }
    }

    inline void updateRoom(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int roomId = ctx->getProps("roomId");
            const std::string name = ctx->getProps("name");
            const std::string code = ctx->getProps("code");
            const int testId = ctx->getProps("quizId");
            const std::string createdAt = ctx->getProps("openedAt");
            const std::string closedAt = ctx->getProps("closedAt");

            const auto room = service::quiz::updateRoom(sessionId, roomId, name, code,
                                                    testId, createdAt, closedAt);
            ctx->writeClient(room->toJson().dump());
        } catch (std::exception& e) {
            ctx->writeClient(nlohmann::json({{"err", e.what()}}).dump().c_str());
        }
    }

    inline void joinRoom(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const std::string code = ctx->getProps("code");
            
            const auto room = service::quiz::joinRoom(sessionId, code);
            auto response = room->toJson();
            response["status"] = "Success";
            ctx->writeClient(response.dump().c_str());
        } catch (std::exception& e) {
            ctx->writeClient(nlohmann::json({{"err", e.what()}}).dump().c_str());
        }
    }
    
    inline void getRoomResult(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int roomId = ctx->getProps("roomId");
            const int page = ctx->getProps("page") == nullptr ? 1 : ctx->getProps("page").get<int>();

            const auto results = service::quiz::getRoomResult(sessionId, roomId, page);
            nlohmann::json jsonResults = nlohmann::json::array();
            for (const auto& result : results) {
                jsonResults.push_back(result.toJson());
            }
            ctx->writeClient(jsonResults.dump().c_str());

        } catch (std::exception& e) {
            ctx->writeClient(nlohmann::json({{"err", e.what()}}).dump().c_str());
        }
    }

    inline void getHistoryResult(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const int page = ctx->getProps("page") == nullptr ? 1 : ctx->getProps("page").get<int>();

            const auto history = service::quiz::getHistoryResult(sessionId, page);
            nlohmann::json jsonHistory = nlohmann::json::array();
            for (const auto& result : history) {
                jsonHistory.push_back(result.toJson());
            }
            ctx->writeClient(jsonHistory.dump());
        } catch (std::exception& e) {
            ctx->writeClient(nlohmann::json({{"err", e.what()}}).dump().c_str());
        }
    }
}

#endif