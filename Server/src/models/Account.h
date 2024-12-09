#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>

namespace model::auth {

    class Account {
    private:
        int id;
        std::string username;
        std::string password;

    public:
        Account(const int id, const std::string& username, const std::string& password)
            : id(id), username(username), password(password) {}
        ~Account() = default;

        int getId() const {
          return id;
        }

        std::string getUsername() const {
            return username;
        }

        std::string getPassword() const {
            return password;
        }

        nlohmann::json toJson() const {
            nlohmann::json json;
            json["id"] = id;
            json["username"] = username;
            json["password"] = password;
            return json;
        }
    };
} // namespace model::auth

#endif // ACCOUNT_H
