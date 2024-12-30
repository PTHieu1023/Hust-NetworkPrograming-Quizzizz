#ifndef AUTHCONTROLLER_H
#define AUTHCONTROLLER_H

#include "fcp/core/context.h"
#include "models/Account.h"
#include "services/AuthService.h"

#include <vector>
#include <memory>

namespace controller::auth{
    void login(const fcp::Context* ctx);
    void logout(const fcp::Context *ctx);

    inline void login(const fcp::Context *ctx) {
        std::vector<std::unique_ptr<model::auth::Account>> accounts = service::auth::getAccounts();
        nlohmann::json jsonAccounts = nlohmann::json::array();
        for (const auto& account : accounts) {
            jsonAccounts.push_back(account.get()->toJson());
        }
        ctx->writeClient(reinterpret_cast<const std::byte*>(jsonAccounts.dump().c_str()), sizeof(model::auth::Account) * accounts.size());
    }

    inline void logout(const fcp::Context *ctx) {
        return;
    }
}
#endif //AUTHCONTROLLER_H
