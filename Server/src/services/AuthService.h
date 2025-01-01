#ifndef AUTH_H
#define AUTH_H

#include <memory>
#include <pqxx/pqxx>

#include "fcp/core/database.h"

#include "models/UserSession.h"

#include "utils/password.h"

namespace service::auth {
    std::unique_ptr<model::auth::UserSession> login(const std::string& username, const std::string& password);
    void signUp(const std::string &username, const std::string &password, const std::string &name);
    void logout(std::string session_id);
    void updatePassword(const std::string& sessionId, const std::string& oldPassword, const std::string& newPassword);
    int verifySession(const std::string& sessionId);

    inline std::unique_ptr<model::auth::UserSession> login(const std::string& username, const std::string& password) {
        try {
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());

            // Query the database to find the user by username and password
            const pqxx::result query_set = txn.exec_params(
                "SELECT user_id, username, name FROM users WHERE username = $1 AND password = $2",
                username, utils::password::hash_password(password)  // Assuming password is hashed
            );

            if (query_set.empty()) {
                throw std::runtime_error("Invalid username or password");
            }

            // Create a new session object as std::unique_ptr
            auto session = std::make_unique<model::auth::UserSession>();
            session->setId(query_set[0]["user_id"].as<int>())
                   ->setUsername(query_set[0]["username"].as<std::string>())
                   ->setName(query_set[0]["name"].as<std::string>());

            // Insert a new session into the database and get the session ID
            const pqxx::result new_session = txn.exec_params(
                "INSERT INTO session (user_id) VALUES ($1) RETURNING session_id;",
                session->getId()
            );

            if (new_session.empty()) {
                throw std::runtime_error("Session creation failed");
            }

            // Set the session ID from the database
            session->setSessionId(new_session[0]["session_id"].as<std::string>());

            txn.commit();  // Commit the transaction

            return session;  // Return the session as std::unique_ptr
        } catch (const pqxx::sql_error &e) {
            throw std::runtime_error("Database error: " + std::string(e.what()));
        } catch (const std::exception &e) {
            throw std::runtime_error("Unexpected error: " + std::string(e.what()));
        }
    }

    inline void logout(std::string session_id) {
        try {
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());

            txn.exec_params("DELETE FROM session WHERE session_id = $1", session_id);

            txn.commit();

        } catch (const pqxx::sql_error &e) {
            throw std::runtime_error("Database error: " + std::string(e.what()));
        } catch (const std::exception &e) {
            throw std::runtime_error("Unexpected error: " + std::string(e.what()));
        }
    }

    inline void updatePassword(const std::string& sessionId, const std::string& oldPassword, const std::string& newPassword) {
        try {
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());

            // Step 1: Validate session and old password
            const pqxx::result query_set = txn.exec_params(
                "SELECT user_id FROM session WHERE session_id = $1",
                sessionId
            );

            if (query_set.empty()) {
                throw std::runtime_error("Unauthorized session");
            }

            int userId = query_set[0]["user_id"].as<int>();

            const pqxx::result update_result = txn.exec_params(
                "UPDATE users SET password = $1 WHERE user_id = $2 AND password = $3",
                utils::password::hash_password(newPassword), // Ensure the new password is hashed
                userId,
                utils::password::hash_password(oldPassword) // Re-hash the old password for comparison
            );

            if (update_result.affected_rows() == 0) {
                throw std::runtime_error("Password update failed. Either the old password was incorrect or no matching user found.");
            }

            txn.commit();
        } catch (const pqxx::sql_error& e) {
            throw std::runtime_error("Database error: " + std::string(e.what()));
        } catch (const std::exception& e) {
            throw std::runtime_error("Unexpected error: " + std::string(e.what()));
        }
    }

    inline int verifySession(const std::string &sessionId) {
        try {
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());

            // Step 1: Validate session and old password
            const pqxx::result query_set = txn.exec_params(
                "SELECT user_id FROM session WHERE session_id = $1", sessionId);
            if (query_set.empty()) {
                throw std::runtime_error("Unauthorized session");
            }
            return  query_set[0]["user_id"].as<int>();
        }catch (const pqxx::sql_error &e) {
            throw std::runtime_error("Database error: " + std::string(e.what()));
        } catch (const std::exception &e) {
            throw std::runtime_error("Unexpected error: " + std::string(e.what()));
        }
    }

    inline void signUp(const std::string &username, const std::string &password, const std::string &name) {
        try {
            const auto conn = fcp::DB::getInstance()->getConnection();

            pqxx::work txn(*conn);

            txn.exec_params(
                "INSERT INTO users (username, password, name) VALUES ($1, $2, $3)",
                username,
                utils::password::hash_password(password),
                name
            );

            txn.commit();
        } catch (const pqxx::sql_error &e) {
            throw std::runtime_error("Database error: " + std::string(e.what()));
        } catch (const std::exception &e) {
            throw std::runtime_error("Unexpected error: " + std::string(e.what()));
        }
    }

}

#endif // AUTH_H
