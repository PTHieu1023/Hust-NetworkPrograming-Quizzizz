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
        std::string payload = ctx->getProps("username");
        printf("%s\n", payload.c_str());
        const std::string res = jsonAccounts.dump().c_str();
        ctx->writeClient(res);
    }
    inline void logout(const fcp::Context *ctx) {
        return;
    }
}
#endif //AUTHCONTROLLER_H
