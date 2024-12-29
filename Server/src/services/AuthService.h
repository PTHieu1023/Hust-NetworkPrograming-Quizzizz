#ifndef AUTH_H
#define AUTH_H

#include <vector>
#include <memory>
#include <pqxx/pqxx>

#include "models/Account.h"
#include "fcp/core/database.h"

#include "utils/password.h"

namespace service::auth {
    inline int login(int socket_id, const std::string& username, const std::string& password) {
        try {
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());

            pqxx::result query_set = txn.exec_params(
                "SELECT id FROM account WHERE username = $1 AND password = $2",
                username, utils::password::hash_password(password)
            );

            if (query_set.empty()) {
                std::cerr << "Invalid username or password." << std::endl;
                return -1;
            }

            // Extract user ID
            int user_id = query_set[0]["id"].as<int>();

            // Check if socket_fd already exists and delete it
            txn.exec_params("DELETE FROM session WHERE socket_fd = $1", socket_id);

            // Insert a new session
            const pqxx::result new_session = txn.exec_params(
                "INSERT INTO session (user_id, socket_fd) VALUES ($1, $2) RETURNING id;",
                user_id, socket_id
            );

            if (new_session.empty()) {
                std::cerr << "Failed to create a new session." << std::endl;
                return -1; // Session creation failed
            }

            // Commit transaction
            txn.commit();

            std::cout << "Login successful. Session ID: " << new_session[0]["id"].as<int>() << std::endl;
            return new_session[0]["id"].as<int>(); // Return session ID

        } catch (const std::exception& e) {
            throw e;
        }
    }

    inline int logout(int socket_id) {
        try {
            // Establish database connection
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());

            // Delete session for the given socket ID
            txn.exec_params("DELETE FROM session WHERE socket_fd = $1", socket_id);

            // Commit transaction
            txn.commit();

            std::cout << "Logout successful for socket ID: " << socket_id << std::endl;
            return 0; // Success

        } catch (const std::exception& e) {
            std::cerr << "Error on logout: " << e.what() << std::endl;
            return -1; // Exception occurred
        }
    }

    inline std::vector<std::unique_ptr<model::auth::Account>> getAccounts() {
        try {
            // Start a transaction
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());
            std::vector<std::unique_ptr<model::auth::Account>> accounts;
            // Execute the query
            pqxx::result query_set = txn.exec("SELECT id, username, password FROM account");

            // Loop through the query result
            for (const auto& row : query_set) {
                // Create an Account object from the row data
                accounts.push_back(std::make_unique<model::auth::Account>(
                    row["id"].as<int>(),
                    row["username"].as<std::string>(),
                    row["password"].as<std::string>()
                ));
            }

            return accounts;
        } catch (const std::exception& e) {
            throw e;
        }
    }

}

#endif // AUTH_H
