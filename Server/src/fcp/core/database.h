#ifndef DATABASE_H
#define DATABASE_H

#include <pqxx/pqxx>
#include <memory>
#include <mutex>
#include <string>
#include <stdexcept>
#include <iostream>

namespace fcp {
    class DB {
    public:
        // Static method to get the singleton instance
        static DB* getInstance() {
            // thread-safe instance creation using std::call_once
            std::call_once(initInstanceFlag, []() {
                instance.reset(new DB());
            });
            return instance.get();
        }

        // Destructor to clean up the connection when no longer needed
        ~DB() = default;  // No need to manually close since unique_ptr will handle it

        // Provide access to the connection (if needed)
        pqxx::connection* getConnection() const {
            return conn.get();
        }

        // Execute an SQL query (for SELECT queries)
        pqxx::result query(const std::string& sql) {
            try {
                pqxx::work txn(*conn);
                pqxx::result result = txn.exec(sql);
                return result;  // Return the result of the query
            } catch (const std::exception& e) {
                std::cerr << "Query execution failed: " << e.what() << std::endl;
                throw std::runtime_error("Query execution failed: " + std::string(e.what()));
            }
        }

        // Execute an SQL command (for UPDATE, INSERT, DELETE)
        void exec(const std::string& sql) {
            try {
                pqxx::work txn(*conn);
                txn.exec(sql);  // Execute the SQL command
                txn.commit();   // Commit the transaction
            } catch (const std::exception& e) {
                std::cerr << "SQL execution failed: " << e.what() << std::endl;
                throw std::runtime_error("SQL execution failed: " + std::string(e.what()));
            }
        }

    private:
        // Private constructor to prevent direct instantiation
        DB() {
            // Initialize the connection to the database
            try {
                conn = std::make_unique<pqxx::connection>("host=localhost dbname=quizz user=quizz password=quizz");
                if (!conn->is_open()) {
                    throw std::runtime_error("Failed to connect to database");
                }
            } catch (const std::exception& e) {
                // Handle connection error (optional)
                throw std::runtime_error("Database connection failed: " + std::string(e.what()));
            }
        }

        // Private static instance of DB (initialized as nullptr)
        static std::unique_ptr<DB> instance;
        static std::once_flag initInstanceFlag;  // To ensure instance creation is thread-safe

        // Database connection
        std::unique_ptr<pqxx::connection> conn;
    };

    // Initialize the static instance to nullptr
    std::unique_ptr<DB> DB::instance = nullptr;
    std::once_flag DB::initInstanceFlag;
}

#endif // DATABASE_H
