#include "fcp/core/server.h"

#include "handlers/AuthController.h"
#include "handlers/QuestionController.h"

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

    // Run TCP server
    server.start();
    return 0;
}
