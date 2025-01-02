#include "fcp/core/server.h"

#include "handlers/AuthController.h"


int main()
{
    fcp::Server server(PORT);
    server.use(0x0000, controller::auth::login);
    server.use(0x0001, controller::auth::signUp);
    server.use(0x0002, controller::auth::logout);
    server.use(0x0003, controller::auth::changePassword);

    // Question bank API
    server.use(0x000C, controller::question::createQuestion);
    server.use(0x000D, controller::question::getQuestions);
    server.use(0x000E, controller::question::updateQuestion);
    server.use(0x000F, controller::question::deleteQuestion);
    server.use(0x0010, controller::question::getOneQuestion);

    // Run TCP server

    // Test & Room handlers
    server.use(0x0004, controller::test::createTest); // createTest success
    server.use(0x0005, controller::test::createTest); // createTest fail
    server.use(0x0006, controller::test::getTests);
    server.use(0x0007, controller::test::createRoom);
    server.use(0x0008, controller::test::getRooms);
    server.use(0x0009, controller::test::deleteRoom);
    server.use(0x000A, controller::test::updateRoom);
    server.use(0x000B, controller::test::joinRoom);
    server.use(0x0011, controller::test::getRoomResult);
    server.use(0x0012, controller::test::getHistoryResult);

    server.start();
    return 0;
}
