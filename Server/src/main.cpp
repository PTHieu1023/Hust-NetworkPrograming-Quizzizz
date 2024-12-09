#include "fcp/core/server.h"

#include "handlers/AuthController.h"

int main()
{
    fcp::Server server(PORT);
    server.use(0x1234, controller::auth::login);
    server.start();
    return 0;
}