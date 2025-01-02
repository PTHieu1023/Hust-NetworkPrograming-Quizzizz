#ifndef QUESTIONCONTROLLER_H
#define QUESTIONCONTROLLER_H

#include "fcp/core/context.h"

#include "services/QuestionService.h"

namespace controller::question
{
    void createQuestion(const fcp::Context *ctx);
    // void getQuestions(const fcp::Context *ctx);
    // void updateQuestion(const fcp::Context *ctx);
    // void deleteQuestion(const fcp::Context *ctx);
    // void getOneQuestion(const fcp::Context *ctx);
}

#endif // QUESTIONCONTROLLER_H
