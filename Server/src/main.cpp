#include "fcp/core/server.h"

#include "handlers/AuthController.h"
#include "handlers/QuestionController.h"
#include "handlers/TestController.h"

int main()
{
    fcp::Server server(PORT);

    // Auth API
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

    server.use(0x0004, controller::quiz::createQuiz);
    server.use(0x0005, controller::question::getQuizQuestion);
    server.use(0x0006, controller::quiz::getQuizzes);
    server.use(0x0007, controller::quiz::createRoom);
    server.use(0x0008, controller::quiz::getRooms);
    server.use(0x0009, controller::quiz::deleteRoom);
    server.use(0x000A, controller::quiz::updateRoom);
    server.use(0x000B, controller::quiz::joinRoom);
    server.use(0x0011, controller::quiz::getRoomResult);
    server.use(0x0012, controller::quiz::getHistoryResult);

    // Run TCP server
    server.start();
    return 0;
}
