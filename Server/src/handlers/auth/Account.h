#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>

namespace auth {
    class Account {
    private:
        std::string login;
        std::string password;
        time_t created_at;
    public:
        Account(std::string login, std::string password);
        std::string getLogin();
        std::string getPassword();
        time_t getCreatedAt();
    };
} // auth

#endif //ACCOUNT_H
