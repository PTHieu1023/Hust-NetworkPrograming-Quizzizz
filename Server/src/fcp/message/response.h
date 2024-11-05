#ifndef RESPONSE_H
#define RESPONSE_H

#include <iomanip>
#include "fcp/message/message.h"

namespace fcp::message
{
    enum StatusCode
    {
        // Success codes
        SUCCESS = 0x20,
        CREATED = 0x21,
        MODIFIED = 0x22,
        ACCEPTED = 0x23,
        DELETED = 0x24,

        // User error codes
        BAD_REQUEST = 0x10,
        UNAUTHORIEZED = 0x11,
        FORBIDDEN = 0x12,
        NOT_FOUND = 0x13,
        TIME_OUT = 0x14,

        // System error codes
        INTERNAL_ERROR = 0x00,
        NOT_IMPLEMENTED = 0x01,
    };

    class Response : public message::Message
    {
    private:
        StatusCode status_code;

    public:
        Response() = default;
        ~Response() = default;
        StatusCode get_status_code() const;
        static std::unique_ptr<Response> parse(const std::string &request_str);
        std::string deparse() const;
    };

    inline StatusCode Response::get_status_code() const
    {
        return status_code;
    }

    inline std::unique_ptr<Response> Response::parse(const std::string &response_str)
    {
        auto response = std::make_unique<Response>();
        std::istringstream stream(response_str);
        std::string line;

        // Parse the status code
        if (std::getline(stream, line))
        {
            int x = std::stoi(line, nullptr, 16);
            response->status_code = static_cast<StatusCode>(std::stoi(line, nullptr, 16));
        }

        // Parse headers
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

                response->set_header(key, value);
            }
        }

        // Parse body (remaining content after the empty line)
        response->body.assign((std::istreambuf_iterator<char>(stream)), std::istreambuf_iterator<char>());

        return response;
    }
    inline std::string Response::deparse() const
    {
        std::ostringstream response_str;

        // Append the status code in hexadecimal format (2 digits)
        response_str << "0x" << std::hex << std::setw(3) << std::setfill('0') << static_cast<int>(status_code) << "\n";

        response_str << this->header.get()->to_string()
                     << "\n"
                     << body;

        return response_str.str();
    }
}

#endif