#include "Question.h"


int model::question::Question::getId() const {
    return id;
}

model::question::Question * model::question::Question::setId(int id) {
    this->id = id;
    return this;
}

int model::question::Question::getAuthorId() const {
    return authorId;
}

model::question::Question * model::question::Question::setAuthorId(int authorId) {
    this->authorId = authorId;
    return this;
}

std::string model::question::Question::getContent() const {
    return content;
}

model::question::Question * model::question::Question::setContent(const std::string &content) {
    this->content = content;
    return this;
}

std::vector<model::question::QuestionAnswerPtr>& model::question::Question::getAnswers() {
    return this->answers;
}

model::question::Question* model::question::Question::addAnswer(const QuestionAnswerPtr& _answer) {
    this->answers.push_back(_answer);
    return this;
}

nlohmann::json model::question::Question::toJson() const {
    nlohmann::json question;
    question["id"] = this->id;
    question["authorId"] = this->authorId;
    question["content"] = this->content;

    if (answers.size() > 0) {
        // Convert each answer to JSON and add to array
        nlohmann::json answersJson = nlohmann::json::array();
        for (const auto& answer : this->answers) {
            answersJson.push_back(answer->toJson());
        }
        question["answers"] = answersJson;
    }

    return question;
}

model::question::QuestionAnswerPtr model::question::QuestionAnswer::fromJson(nlohmann::json json)  {
    auto answer = std::make_shared<QuestionAnswer>();
    if (json.contains("questionId"))
        answer->setQuestionId(json["questionId"].get<int>());
    if (json.contains("isTrue"))
        answer->setIsTrue(json["isTrue"].get<bool>());
    if (json.contains("content"))
        answer->setContent(json["content"].get<std::string>());
    return answer;
}

nlohmann::json model::question::QuestionAnswer::toJson() const {
    nlohmann::json answer;
    answer["isTrue"] = this->isTrue;
    answer["content"] = this->content;
    return answer;
}

int model::question::QuestionAnswer::getId() const {
    return id;
}

int model::question::QuestionAnswer::getQuestionId() const {
    return questionId;
}

int model::question::QuestionAnswer::getIsTrue() const {
    return isTrue;
}

std::string model::question::QuestionAnswer::getContent() const {
    return content;
}

model::question::QuestionAnswer * model::question::QuestionAnswer::setId(int id) {
    this->id = id;
    return this;
}

model::question::QuestionAnswer * model::question::QuestionAnswer::setQuestionId(int questionId) {
    this->questionId = questionId;
    return this;
}

model::question::QuestionAnswer * model::question::QuestionAnswer::setIsTrue(int isTrue) {
    this->isTrue = isTrue;
    return this;
}

model::question::QuestionAnswer * model::question::QuestionAnswer::setContent(const std::string &content) {
    this->content = content;
    return this;
}

