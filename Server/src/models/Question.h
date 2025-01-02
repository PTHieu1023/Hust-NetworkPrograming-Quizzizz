#ifndef QUESTION_H
#define QUESTION_H

#include <string>
#include <vector>
#include <memory>

#include <nlohmann/json.hpp>

namespace model::question
{
    class QuestionAnswer;
    class Question;
    using QuestionPtr = std::shared_ptr<Question>;
    using QuestionAnswerPtr = std::shared_ptr<QuestionAnswer>;

    class Question
    {
    public:
        Question() = default;
        ~Question() = default;

        int getId() const;
        Question *setId(int id);
        int getAuthorId() const;
        Question *setAuthorId(int authorId);
        std::string getContent() const;
        Question *setContent(const std::string &content);
        std::vector<QuestionAnswerPtr>& getAnswers();
        Question* addAnswer(const QuestionAnswerPtr& _answer);
        nlohmann::json toJson() const;
    private:
        int id;
        int authorId;
        std::string content;
        std::vector<QuestionAnswerPtr> answers;
    };

    class QuestionAnswer
    {
    public:
        QuestionAnswer() = default;
        ~QuestionAnswer() = default;

        static QuestionAnswerPtr fromJson(nlohmann::json json);

        nlohmann::json toJson() const;

        int getQuestionId() const;
        int getIsTrue() const;
        std::string getContent() const;

        QuestionAnswer *setQuestionId(int questionId);
        QuestionAnswer *setIsTrue(int isTrue);
        QuestionAnswer *setContent(const std::string &content);

    private:
        int questionId;
        bool isTrue;
        std::string content;
    };
}

#endif // QUESTION_H
