#ifndef QUESTIONSERVICE_H
#define QUESTIONSERVICE_H

#include "models/Question.h"

namespace service::question
{
    model::question::QuestionPtr createQuestion(int authorId, std::string content, const std::vector<model::question::QuestionAnswerPtr> &answers);
}

#endif // QUESTIONSERVICE_H
