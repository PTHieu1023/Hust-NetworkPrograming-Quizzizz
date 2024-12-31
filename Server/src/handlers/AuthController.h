#ifndef AUTHCONTROLLER_H
#define AUTHCONTROLLER_H

#include "fcp/core/context.h"
#include "models/Account.h"
#include "services/AuthService.h"

#include <memory>

namespace controller::auth{
    void login(const fcp::Context* ctx);
    void logout(const fcp::Context *ctx);
    void signUp(const fcp::Context *ctx);
    void changePassword(const fcp::Context *ctx);

    inline void signUp(const fcp::Context* ctx) {
        nlohmann::json json;
        try {
            const std::string username  = ctx->getProps("username");
            const std::string password = ctx->getProps("password");
            const std::string name = ctx->getProps("name");
            service::auth::signUp(username, password, name);
            json["message"] = "Sign Up Successful";
        }catch (std::exception& e) {
            json["err"] = e.what();
        }
        const std::string res = json.dump().c_str();
        printf("Response: %s\n", res.c_str());
        ctx->writeClient(res);
    }

    inline void login(const fcp::Context *ctx) {
        nlohmann::json json;
        try {
            const std::unique_ptr<model::auth::UserSession>  session =
                service::auth::login(ctx->getProps("username"), ctx->getProps("password"));
            json = session.get()->toJson();
        }catch (std::exception& e) {
            json["err"] = e.what();
        }
        const std::string res = json.dump().c_str();
        printf("Response: %s\n", res.c_str());
        ctx->writeClient(res);
    }

    inline void logout(const fcp::Context *ctx) {
        nlohmann::json json;
        try {
            service::auth::logout(ctx->getProps("session_id"));
            json["message"] = "Logout success!";
        }catch (std::exception& e) {
            json["err"] = e.what();
        }
        const std::string res = json.dump().c_str();
        printf("Response: %s\n", res.c_str());
        ctx->writeClient(res);
    }

    inline void changePassword(const fcp::Context *ctx) {
        nlohmann::json json;
        try {
            const std::string sessionId = ctx->getProps("sessionId");
            const std::string oldPassword = ctx->getProps("currentPassword");
            const std::string newPassword = ctx->getProps("newPassword");
            const std::string confirmPassword = ctx->getProps("confirmPassword");
            if (newPassword != confirmPassword) {
                throw std::invalid_argument("Invalid confirmPassword");
            }
            service::auth::updatePassword(sessionId, oldPassword, newPassword);
            json["message"] = "Password Updated!";
        }catch (std::exception& e) {
            json["err"] = e.what();
        }
        const std::string res = json.dump().c_str();
        printf("Response: %s\n", res.c_str());
        ctx->writeClient(res);
    }
}
#endif //AUTHCONTROLLER_H
