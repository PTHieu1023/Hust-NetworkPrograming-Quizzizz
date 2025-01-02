#ifndef TEST_H
#define TEST_H

#include <string>
#include <vector>
#include <nlohmann/json.hpp>

namespace model::quiz {
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

    class Quiz {
    public:
        int id;
        std::string name;
        std::vector<std::string> questions;
        int authorId;

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["quizId"] = id;
            json["name"] = name;
            json["authorId"] = authorId;
            json["questions"] = questions;
            return json;
        }

        nlohmann::json toListJson() const {
            nlohmann::json json;
            json["id"] = id;
            json["name"] = name;
            return json;
        }
    };

    class Room {
    public:
        int id;
        std::string name;
        std::string code;
        int quizId;
        std::string createdAt;
        std::string closedAt;
        int hostId;
        std::string hostName;
        int participantId;

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["hostId"] = hostId;
            json["name"] = name;
            json["code"] = code;
            json["testId"] = quizId;
            json["createdAt"] = createdAt;
            json["closedAt"] = closedAt;
            if (!hostName.empty()) {
                json["hostName"] = hostName;
            }
            if(participantId > 0) {
                json["participantId"] = participantId;
            }
            return json;
        }
    };
    class RoomResult {
    public:
        std::string username;
        int result;

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["username"] = username;
            json["result"] = result;
            return json;
        }
    };

    class HistoryResult {
    public:
        int roomId; 
        std::string roomName;
        int result;

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["roomId"] = roomId;
            json["roomName"] = roomName;
            json["result"] = result;
            return json;
        }
    };
}

#endif