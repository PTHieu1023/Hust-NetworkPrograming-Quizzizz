#include "QuestionService.h"

#include <fcp/core/database.h>

model::question::QuestionPtr service::question::createQuestion(
    int authorId, std::string content,
    const std::vector<model::question::QuestionAnswerPtr> &answers) {
    try{
        const auto conn = fcp::DB::getInstance()->getConnection();
        pqxx::work txn(*conn);

        // Create new question
        const pqxx::result result = txn.exec_params(
            "INSERT INTO question (author_id, content) VALUES ($1, $2) RETURNING question_id;",
            authorId, content);

        if (result.empty())
            throw std::runtime_error("Failed to insert question.");

        auto question = std::make_shared<model::question::Question>();
        question
            ->setId(result[0]["question_id"].as<int>())
            ->setAuthorId(authorId)
            ->setContent(content);

        // Answers for questions
        for (auto &answer : answers)
        {
            pqxx::result q_answer = txn.exec_params(
                "INSERT INTO question_answer(question_id, content, is_true) VALUES ($1, $2, $3) RETURNING id;",
                question->getId(), answer->getContent(), answer->getIsTrue());
            if (q_answer.empty())
                throw std::runtime_error("Failed to insert question");
            answer->setQuestionId(question->getId());
            question.get()->addAnswer(answer);
        }

        txn.commit();

        return question;
    }
    catch (const pqxx::sql_error &e)
    {
        throw std::runtime_error("Database error: " + std::string(e.what()));
    }
    catch (const std::exception &e)
    {
        throw std::runtime_error("Unexpected error: " + std::string(e.what()));
    }
}
