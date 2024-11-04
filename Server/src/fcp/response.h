#ifndef RESPONSE_H
#define RESPONSE_H

#include <map>
#include <string>

namespace fcp
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
    class Response
    {
    private:
        StatusCode status;
        std::map<std::string, std::string> headers;
        std::string body;

    public:
        Response();
        ~Response();
        StatusCode getStatus() const;
        std::string getHeader(std::string &header);
        std::string getBody() const;
    };
}

#endif