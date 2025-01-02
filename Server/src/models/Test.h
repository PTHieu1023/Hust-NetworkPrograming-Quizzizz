#ifndef TEST_H
#define TEST_H

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

namespace model::test {
    struct Response {
        static nlohmann::json success(const nlohmann::json& data) {
            nlohmann::json response = data;
            response["status"] = "Success";
            return response;
        }

        static nlohmann::json fail(const std::string& message) {
            nlohmann::json json;
            json["status"] = "Fail";
            json["message"] = message;
            return json;
        }
    };

    class Test {
    public:
        int id;
        std::string name;
        std::vector<std::string> questions;
        bool isPrivate;
        int authorId;

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["name"] = name;
            json["questions"] = questions;
            json["isPrivate"] = isPrivate;
            return json;
        }

        nlohmann::json toListJson() const {
            nlohmann::json json;
            json["id"] = id;
            json["name"] = name;
            json["isPrivate"] = isPrivate;
            return json;
        }
    };

    class Room {
    public:
        int id;
        std::string name;
        std::string code;
        int testId;
        bool isPractice;
        bool isPrivate;
        std::string createdAt;
        std::string closedAt;
        int hostId;
        std::string hostName;
        int participantId;

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["hostId"] = hostId;
            json["hostName"] = hostName;
            json["name"] = name;
            json["code"] = code;
            json["testId"] = testId;
            json["isPractice"] = isPractice;
            json["isPrivate"] = isPrivate;
            json["createdAt"] = createdAt;
            json["closedAt"] = closedAt;
            if(participantId > 0) {
                json["participant_id"] = participantId;
            }
            return json;
        }
    };
    class RoomResult {
    public:
        std::string username;
        std::string name;
        double result;

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["username"] = username;
            json["name"] = name;
            json["result"] = result;
            return json;
        }
    };

    class HistoryResult {
    public:
        int roomId; 
        std::string roomName;
        double result;
        std::string completedAt;

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["roomId"] = roomId;
            json["roomName"] = roomName;
            json["result"] = result;
            json["completedAt"] = completedAt;
            return json;
        }
    };
}

#endif