#ifndef DATABASE_H
#define DATABASE_H

#include <pqxx/pqxx>
#include <memory>
#include <string>
#include <stdexcept>
#include <iostream>

namespace fcp {
    class DB {
    public:
        static DB* getInstance();
        ~DB() = default;
        pqxx::connection* getConnection() const;
    private:
        DB();
        std::unique_ptr<pqxx::connection> conn;
    };
}

#endif // DATABASE_H
