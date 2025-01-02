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

std::vector<model::question::QuestionPtr> service::question::getAll(int userId, int page) {
    try{
        const auto conn = fcp::DB::getInstance()->getConnection();
        pqxx::work txn(*conn);

        const pqxx::result result = txn.exec_params(
            "SELECT * FROM question WHERE author_id = $1 ORDER BY question_id OFFSET $2 LIMIT 6",
            userId, --page * 6);

        std::vector<model::question::QuestionPtr> questions;
        for (const auto &row : result) {
            const auto question = std::make_shared<model::question::Question>();
            question.get()
            ->setId(row["question_id"].as<int>())
            ->setAuthorId(row["author_id"].as<int>())
            ->setContent(row["content"].as<std::string>());
            questions.push_back(question);
        }
        return questions;
    } catch (const pqxx::sql_error &e){
        throw std::runtime_error("Database error: " + std::string(e.what()));
    } catch (const std::exception &e){
        throw std::runtime_error("Unexpected error: " + std::string(e.what()));
    }
}

model::question::QuestionPtr service::question::getById(const int userId,const int questionId) {
    try{const auto conn = fcp::DB::getInstance()->getConnection();
        pqxx::work txn(*conn);

        const std::string query =
            "select q.question_id , q.author_id, q.content as question_content ,qa.id as answer_id, coalesce (qa.content, '') as answer_content, coalesce (qa.is_true, false) as is_true "
            "from question q left join question_answer qa on q.question_id = qa.question_id "
            "where q.question_id = $1";

        const pqxx::result result = txn.exec_params(query, questionId);

        if (result.empty()) {
            throw std::runtime_error("Data not found");
        }

        const auto question = std::make_shared<model::question::Question>();
        question->setId(result[0]["question_id"].as<int>());
        question->setContent(result[0]["question_content"].as<std::string>());
        question->setAuthorId(result[0]["author_id"].as<int>());

        for (const auto &row : result) {
            if (row["answer_id"].is_null()) continue;
            const auto answer = std::make_shared<model::question::QuestionAnswer>();
            answer->setId(row["question_id"].as<int>());
            answer->setContent(row["answer_content"].as<std::string>());
            if (question->getAuthorId() == userId) // Check if author then show answer
                answer->setIsTrue(row["is_true"].as<bool>());
            question->addAnswer(answer);
        }
        return question;
    } catch (const pqxx::sql_error &e){
        throw std::runtime_error("Database error: " + std::string(e.what()));
    } catch (const std::exception &e){
        throw std::runtime_error("Unexpected error: " + std::string(e.what()));
    }
}

model::question::QuestionPtr service::question::updateQuestion(const model::question::QuestionPtr &question) {
    try{
        const auto conn = fcp::DB::getInstance()->getConnection();
        pqxx::work txn(*conn);

        // Create new question
        const pqxx::result result = txn.exec_params(
            "UPDATE question set content = $1 WHERE question_id = $2;",
            question->getContent(), question->getId());

        txn.exec_params(
            "DELETE FROM question_answer WHERE question_id = $1",
            question->getId());

        if (result.affected_rows() == 0)
            throw std::runtime_error("Failed to insert question.");

        // Answers for questions
        for (auto &answer : question->getAnswers())
        {
            pqxx::result q_answer = txn.exec_params(
                "INSERT INTO question_answer(question_id, content, is_true) VALUES ($1, $2, $3) RETURNING id;",
                question->getId(), answer->getContent(), answer->getIsTrue());
            if (q_answer.empty())
                throw std::runtime_error("Failed to insert question");
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

void service::question::deleteQuestion(int questionId) {
    try{
        const auto conn = fcp::DB::getInstance()->getConnection();
        pqxx::work txn(*conn);
        const pqxx::result result = txn.exec_params("DELETE FROM question WHERE question_id = $1;", questionId);
        txn.commit();
    } catch (const pqxx::sql_error &e){
        throw std::runtime_error("Database error: " + std::string(e.what()));
    } catch (const std::exception &e){
        throw std::runtime_error("Unexpected error: " + std::string(e.what()));
    }
}
