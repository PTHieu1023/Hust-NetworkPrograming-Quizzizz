#ifndef REQUEST_H
#define REQUEST_H

#include <string>
#include <memory>
#include <sstream>
#include <algorithm>
#include "header.h"

namespace fcp::request
{
    class Request
    {
    private:
        std::string func_call;
        std::unique_ptr<header::Header> header;
        std::string body;

    public:
        Request() = default;
        ~Request() = default;

        std::string get_func_call() const;
        std::string get_header(const std::string &key) const;
        std::string get_body() const;

        void set_header(const std::string &key, const std::string &value);

        static std::unique_ptr<Request> parse(const std::string &request_str);
        std::string deparse() const;
    };

    inline std::string Request::get_func_call() const
    {
        return this->func_call;
    }

    inline void Request::set_header(const std::string &key, const std::string &value)
    {
        if (!header)
            this->header = std::make_unique<header::Header>();
        header.get()
            ->set_header(key, value);
    }

    inline std::string Request::get_header(const std::string &key) const
    {
        return header.get()->get_header(key);
    }

    inline std::string Request::get_body() const
    {
        return this->body;
    }

    inline std::unique_ptr<Request> Request::parse(const std::string &request_str)
    {
        auto request = std::make_unique<Request>();
        std::istringstream stream(request_str);
        std::string line;

        // Parse the function path or method line
        if (std::getline(stream, line))
        {
            request->func_call = std::move(line);
        }

        // Parse headers until an empty line is found
        while (std::getline(stream, line) && !line.empty())
        {
            auto colon_pos = line.find(':');
            if (colon_pos != std::string::npos)
            {
                std::string key = line.substr(0, colon_pos);
                std::string value = line.substr(colon_pos + 1);

                // Trim leading and trailing whitespace from value
                value.erase(0, value.find_first_not_of(" \t"));
                value.erase(value.find_last_not_of(" \t") + 1);

                if (!key.empty())
                {
                    request->set_header(key, value);
                }
            }
        }

        // Parse the body (remaining content after the empty line)
        request->body.assign((std::istreambuf_iterator<char>(stream)), std::istreambuf_iterator<char>());

        return request;
    }

    inline std::string Request::deparse() const
    {
        std::string request_str(this->func_call.c_str());
        if (header)
        {
            request_str
                .append("\n")
                .append(header->to_string());
        }
        return request_str.append("\n").append(this->body);
    }

} // namespace fcp

#endif
