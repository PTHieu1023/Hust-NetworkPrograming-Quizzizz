#include <iostream>

#include "fcp/core/server.h"

int main()
{
    std::unique_ptr<fcp::core::Server> server = std::make_unique<fcp::core::Server>();
    server->start([&](fcp::core::Server *server) {
        std::cout << "Server started" << std::endl;
    });
    return 0;
}