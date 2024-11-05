#ifndef MESSAGE_H
#define MESSAGE_H

#include <string>
#include <memory>

#include "fcp/message/header.h"

namespace fcp::message
{
    class Message
    {
    protected:
        std::unique_ptr<Header> header;
        std::string body;

    public:
        Message() = default;
        ~Message() = default;

        virtual std::string get_header(const std::string &key) const;
        virtual std::string get_body() const;

        virtual Message *set_header(const std::string &key, const std::string &value);
        virtual Message *set_body(const std::string &body);
    };

    inline std::string Message::get_header(const std::string &key) const
    {
        return header.get()->get_header(key);
    }

    inline std::string Message::get_body() const
    {
        return this->body;
    }

    inline Message *Message::set_header(const std::string &key, const std::string &value)
    {
        if (!header)
            this->header = std::make_unique<Header>();
        header.get()
            ->set_header(key, value);
        return this;
    }

    inline Message *Message::set_body(const std::string &body)
    {
        this->body = body;
        return this;
    }
}

#endif