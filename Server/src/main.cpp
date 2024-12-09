#include "fcp/core/server.h"

#include "handlers/auth/AuthController.h"

int main()
{
    fcp::Server server(PORT);
    server.use(0x00, auth::login);
    server.start();
    return 0;
}
