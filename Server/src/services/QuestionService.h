#ifndef QUESTIONSERVICE_H
#define QUESTIONSERVICE_H

#include "models/Question.h"

namespace service::question
{
    model::question::QuestionPtr createQuestion(int authorId, std::string content, const std::vector<model::question::QuestionAnswerPtr> &answers);
    std::vector<model::question::QuestionPtr> getAll(int userId, int page);
    model::question::QuestionPtr getById(int userId, int questionId);
    model::question::QuestionPtr updateQuestion(const model::question::QuestionPtr &question);
    void deleteQuestion(int questionId);
    nlohmann::json getRoomQuestion(int userId, int roomId, int page);
    void answerQuestion(int userId, int roomId, int answerId );
}

#endif // QUESTIONSERVICE_H
