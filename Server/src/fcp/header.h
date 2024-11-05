#ifndef HEADER_H
#define HEADER_H

#include <string>
#include <map>
#include <iostream>
#include <cstring>

#include "utils/cstr_collector.h"

namespace fcp::header
{
    // Constant header names as `const char*`
    constexpr const char *CONTENT_LENGTH = "Content-Length";
    constexpr const char *CONTENT_TYPE = "Content-Type";
    constexpr const char *CURRENT_TIME = "Current-Time";
    constexpr const char *AUTHORIZATION = "Authorization";
    constexpr const char *METADATA = "Metadata";
    constexpr const char *PARAMS = "Params";
    constexpr const char *QUERY = "Query";

    // Use a set of `const char*` with the custom comparator
    const utils::CStrSet VALID_HEADERS = {
        CONTENT_LENGTH,
        CONTENT_TYPE,
        CURRENT_TIME,
        AUTHORIZATION,
        METADATA,
        PARAMS,
        QUERY};

    class Header
    {
    private:
        // Use `const char*` as keys to save space
        utils::CStrMap<std::string> headers;

    public:
        Header() = default;
        ~Header() = default;

        void set_header(const std::string &key, const std::string &value);
        std::string get_header(const std::string &key) const;
        std::string to_string() const;
    };

    inline std::string Header::get_header(const std::string &key) const
    {
        auto it = headers.find(key.c_str());
        return (it != headers.end()) ? it->second : "";
    }

    inline void Header::set_header(const std::string &key, const std::string &value)
    {
        // Check if key exists in VALID_HEADERS using `key.c_str()`
        auto it = VALID_HEADERS.find(key.c_str());
        if (it == VALID_HEADERS.end())
        {
            std::cerr << "Invalid header: " << key << std::endl;
            return;
        }
        // Insert key as `const char*` using `key.c_str()`
        headers[*it] = value;
    }

    inline std::string Header::to_string() const
    {
        std::string header_str;
        for (const auto &it : headers)
        {
            header_str.append(it.first).append(": ").append(it.second).append("\n");
        }
        return header_str;
    }
}

#endif // HEADER_H
