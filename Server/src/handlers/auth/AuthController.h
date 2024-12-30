#ifndef AUTHCONTROLLER_H
#define AUTHCONTROLLER_H

#include "fcp/core/context.h"

namespace auth{
    void login(const fcp::Context* ctx);
    void logout();

    inline void login(const fcp::Context *ctx) {

        printf("login: %s %s\n", ctx->getProps("username").c_str(), ctx->getProps("password").c_str());
        const std::string res ="Logged in : " + ctx->getProps("username");
        ctx->writeClient((std::byte*)(res.c_str()), sizeof(res));
    }

    inline void logout(const fcp::Context *ctx) {
    }
}
#endif //AUTHCONTROLLER_H
