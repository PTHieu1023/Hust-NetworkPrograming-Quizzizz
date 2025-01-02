#ifndef USERSESSION_H
#define USERSESSION_H

#include <string>

namespace model::auth {

    class UserSession {
    private:
        int id;
        std::string username;
        std::string name;
        std::string session_id;

    public:
        UserSession() = default;

        ~UserSession() = default;

        int getId() const {
          return id;
        }

        std::string getUsername() const {
            return username;
        }

        std::string getName() const {
            return name;
        }

        std::string getSessionId() const {
            return session_id;
        }

        UserSession* setId(int id) {
            this->id = id;
            return this;
        }
        UserSession* setUsername(const std::string& username) {
            this->username = username;
            return this;
        }
        UserSession* setName(const std::string& name) {
            this->name = name;
            return this;
        }
        UserSession* setSessionId(const std::string& session_id) {
            this->session_id = session_id;
            return this;
        }

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["id"] = id;
            json["username"] = username;
            json["name"] = name;
            json["sessionId"] = session_id;
            return json;
        }
    };
} // namespace model::auth

#endif //USERSESSION_H
