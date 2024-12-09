#ifndef AUTH_H
#define AUTH_H

#include <vector>
#include <memory>
#include <pqxx/pqxx>

#include "models/Account.h"
#include "fcp/core/database.h"

namespace service::auth {
    inline std::vector<std::unique_ptr<model::auth::Account>> getAccounts() {
        std::vector<std::unique_ptr<model::auth::Account>> accounts;

        try {
            // Start a transaction
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());

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
        } catch (const std::exception& e) {
            // Handle the exception
            std::cerr << "Error retrieving accounts: " << e.what() << std::endl;
        }

        return accounts;
    }
}

#endif // AUTH_H
