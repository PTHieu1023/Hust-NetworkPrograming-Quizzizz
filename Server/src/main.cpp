#include "fcp/core/server.h"

#include "handlers/AuthController.h"


int main()
{
    fcp::Server server(PORT);
    server.use(0x1234, controller::auth::login);
    server.use(0x0000, controller::auth::logout);
    server.start();
    return 0;
}
