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

nlohmann::json service::question::getRoomQuestion(int userId, int roomId, int page) {
    try{
        pqxx::work txn(*fcp::DB::getInstance()->getConnection());
        const std::string query =
            "SELECT r.room_id, qt.question_id, qt.content, "
            "CASE WHEN COUNT(qa.id) = 0 "
            "THEN null ELSE json_agg(json_build_object('answerId', qa.id, 'content', qa.content)) "
            "END AS answers "
            "FROM room r join room_participant rp on r.room_id = rp.room_id "
            "LEFT JOIN quizquestion q ON q.quiz_id = r.quiz_id "
            "LEFT JOIN question qt ON qt.question_id = q.question_id "
            "LEFT join question_answer qa ON qa.question_id = qt.question_id "
            "WHERE r.room_id = $1 and rp.participant_id = $2 GROUP by r.room_id, qt.question_id order by qt.question_id offset $3 limit 6";
        const pqxx::result result = txn.exec_params(query, roomId, userId, --page * 6);

        auto questions = nlohmann::json::array();
        for (const auto &row : result) {
            questions.push_back({
                {"roomId", row["room_id"].as<int>()},
                {"questionId", row["question_id"].as<int>(),},
                {"content", row["content"].as<std::string>(),},
                {"answers", row["answers"].is_null() ? nlohmann::json::array() : nlohmann::json::parse(row["answers"].as<std::string>())},
            });
        }
        return questions;
    } catch (const pqxx::sql_error &e){
        throw std::runtime_error("Database error: " + std::string(e.what()));
    } catch (const std::exception &e){
        throw std::runtime_error("Unexpected error: " + std::string(e.what()));
    }
}

void service::question::answerQuestion(int userId, int roomId, int answerId) {
        try{
            pqxx::work txn(*fcp::DB::getInstance()->getConnection());
            pqxx::result result = txn.exec_params(
                "SELECT room_participant_id from room_participant where room_id = $1 and participant_id = $2",
                roomId, userId
                );
            if (result.empty()) {
                result =txn.exec_params(
                    "INSERT INTO room_participant(room_id,participant_id) VALUES ($1, $2) RETURNING room_participant_id;",
                    roomId, userId);
            }

            if (result.empty()) {
                throw std::runtime_error("Failed to answer question.");
            }
            int participantId = result[0]["room_participant_id"].as<int>();

            result = txn.exec_params(
            "select qa.question_id from room r "
                "left join quizquestion qq ON qq.quiz_id = r.quiz_id "
                "left join question_answer qa on qa.question_id = qq.question_id "
                "where r.room_id = $1 and qa.id =$2",
                roomId, answerId);
            if (result.empty()) {
                throw std::runtime_error("Failed to answer question.");
            }
            int questionId = result[0]["question_id"].as<int>();
            // Create new question
            result = txn.exec_params(
                "UPDATE  participant_answer set answer_id = $1 WHERE room_participant_id = $2 AND question_quiz_id = $3;",
                answerId, participantId, questionId);

            if (result.affected_rows() > 0) {
                txn.commit();
                return;
            }
            result = txn.exec_params(
            "INSERT INTO  participant_answer(room_participant_id, question_quiz_id, answer_id) values ($1, $2, $3);",
                            participantId, questionId, answerId);
            txn.commit();
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
