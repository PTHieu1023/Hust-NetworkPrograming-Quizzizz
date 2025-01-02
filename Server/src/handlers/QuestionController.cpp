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
        response = service::question::createQuestion(userId, content, answers)->toJson();
    }catch (std::exception& e) {
        response["err"] = e.what();
    }
    const std::string res = response.dump().c_str();
    printf("Response: %s\n", res.c_str());
    ctx->writeClient(res);
}

void controller::question::getQuestions(const fcp::Context *ctx) {
    nlohmann::json response;
    try {
        const int userId = service::auth::verifySession(ctx->getProps("sessionId"));
        const int page = ctx->getProps("page");
        for (const auto question: service::question::getAll(userId, page)) {
            response.push_back(question->toJson());
        }
    }catch (std::exception& e) {
        response["err"] = e.what();
    }
    const std::string res = response.dump().c_str();
    printf("Response: %s\n", res.c_str());
    ctx->writeClient(res);
}

void controller::question::updateQuestion(const fcp::Context *ctx) {
    nlohmann::json response;
    try {
        const int userId = service::auth::verifySession(ctx->getProps("sessionId"));
        const int questionId = ctx->getProps("questionId");
        const auto existedQuestion = service::question::getById(userId, questionId);
        if (existedQuestion->getAuthorId() != userId)
            throw std::invalid_argument("Only owner can edit this");
        existedQuestion->setContent(ctx->getProps("content"));
        existedQuestion->getAnswers().clear();
        for (const auto &answer: ctx->getProps("answers")) {
            existedQuestion->addAnswer(model::question::QuestionAnswer::fromJson(answer));
        }
        response = service::question::updateQuestion(existedQuestion)->toJson();
    }catch (std::exception& e) {
        response["err"] = e.what();
    }
    const std::string res = response.dump().c_str();
    printf("Response: %s\n", res.c_str());
    ctx->writeClient(res);
}

void controller::question::deleteQuestion(const fcp::Context *ctx) {
    nlohmann::json response;
    try {
        const int userId = service::auth::verifySession(ctx->getProps("sessionId"));
        const int questionId = ctx->getProps("questionId");
        if (const auto existedQuestion = service::question::getById(userId, questionId); existedQuestion->getAuthorId() != userId)
            throw std::invalid_argument("Only owner can delete this");
        service::question::deleteQuestion(questionId);
        response["message"] = "Question deleted";
    }catch (std::exception& e) {
        response["err"] = e.what();
    }
    const std::string res = response.dump().c_str();
    printf("Response: %s\n", res.c_str());
    ctx->writeClient(res);
}

void controller::question::getOneQuestion(const fcp::Context *ctx) {
    nlohmann::json response;
    try {
        const int userId = service::auth::verifySession(ctx->getProps("sessionId"));
        const int questionId = ctx->getProps("questionId");
        response = service::question::getById(userId, questionId)->toJson();
    }catch (std::exception& e) {
        response["err"] = e.what();
    }
    const std::string res = response.dump().c_str();
    printf("Response: %s\n", res.c_str());
    ctx->writeClient(res);
}

void controller::question::getQuizQuestion(const fcp::Context *ctx) {
    nlohmann::json response;
    try {
        const int userId = service::auth::verifySession(ctx->getProps("sessionId"));
        const int roomId = ctx->getProps("roomId");
        const int page = ctx->getProps("page") == nullptr ? 1 : ctx->getProps("page").get<int>();
        response = service::question::getRoomQuestion(userId, roomId, page);
    }catch (std::exception& e) {
        response["err"] = e.what();
    }
    const std::string res = response.dump().c_str();
    printf("Response: %s\n", res.c_str());
    ctx->writeClient(res);
}

void controller::question::answerQuestion(const fcp::Context *ctx) {
    nlohmann::json response;
    try {
        const int userId = service::auth::verifySession(ctx->getProps("sessionId"));
        const int roomId = ctx->getProps("roomId");
        const int answerId = ctx->getProps("answerId");
        service::question::answerQuestion(userId, roomId, answerId);
        response["message"] = "Question answered";
    }catch (std::exception& e) {
        response["err"] = e.what();
    }
    const std::string res = response.dump().c_str();
    printf("Response: %s\n", res.c_str());
    ctx->writeClient(res);
}
