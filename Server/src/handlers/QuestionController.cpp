#include "QuestionController.h"

#include "services/AuthService.h"
#include "services/QuestionService.h"

void controller::question::createQuestion(const fcp::Context *ctx) {
    nlohmann::json response;
    try {
        const int userId = service::auth::verifySession(ctx->getProps("sessionId"));
        const std::string content  = ctx->getProps("content");
        std::vector<model::question::QuestionAnswerPtr> answers;
        for (const auto &answer: ctx->getProps("answers")) {
            answers.push_back(model::question::QuestionAnswer::fromJson(answer));
        }
        model::question::QuestionPtr question = service::question::createQuestion(userId, content, answers);
        response = question->toJson();
    }catch (std::exception& e) {
        response["err"] = e.what();
    }
    const std::string res = response.dump().c_str();
    printf("Response: %s\n", res.c_str());
    ctx->writeClient(res);
}
