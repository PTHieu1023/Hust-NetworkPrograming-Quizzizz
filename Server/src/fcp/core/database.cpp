#include "database.h"

using namespace fcp;

DB* DB::getInstance() {
    static DB instance;  // Static local variable ensures thread safety
    return &instance;
}

DB::DB() {
    try {
        conn = std::make_unique<pqxx::connection>("host=cms-se-hust-g9-cms-se-hust-g9.a.aivencloud.com port=28117 dbname=quizz user=quizz password=quizz");
        if (!conn->is_open()) {
            throw std::runtime_error("Failed to connect to database");
        }
    } catch (const std::exception& e) {
        throw std::runtime_error("Database connection failed: " + std::string(e.what()));
    }
}

pqxx::connection* DB::getConnection() const {
    return conn.get();
}

