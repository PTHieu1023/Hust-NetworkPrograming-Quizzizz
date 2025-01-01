```cpp
#ifndef TESTCONTROLLER_H 
#define TESTCONTROLLER_H

#include "fcp/core/context.h"
#include "services/TestService.h"

namespace controller::test {
    inline void createTest(const fcp::Context* ctx) {
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const std::string name = ctx->getProps("name");
            const auto questions = ctx->getProps("questions").get<std::vector<std::string>>();
            const bool isPrivate = ctx->getProps("isPrivate");

            const auto test = service::test::createTest(sessionId, name, questions, isPrivate);
            auto response = test->toJson();
            response["status"] = "Success";
            ctx->writeClient(response.dump());
        } catch (std::exception& e) {
            ctx->writeClient(model::test::Response::fail(e.what()).dump());
        }
    }

    inline void getTests(const fcp::Context* ctx) {
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
}

#endif
```