#include "fcp/core/server.h"

#include "handlers/AuthController.h"


int main()
{
    fcp::Server server(PORT);
    server.use(0x0000, controller::auth::login);
    server.use(0x0001, controller::auth::signUp);
    server.use(0x0002, controller::auth::logout);
    server.use(0x0003, controller::auth::changePassword);
    server.start();
    return 0;
}
