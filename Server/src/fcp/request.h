#ifndef REQUEST_H
#define REQUEST_H

#include <string>
#include <map>
#include <memory>
#include <sstream>

namespace fcp
{
    class Request
    {
    private:
        std::string func_path;
        std::map<std::string, std::string> headers;
        std::string body;

        friend Request *parse(const std::string &request_str);

    public:
        Request() = default;
        ~Request() = delete;

        // Getter for func_path
        inline std::string get_func_path() const { return func_path; }

        // Setter for headers
        inline void set_header(const std::string &key, const std::string &value) { headers[key] = value; }

        // Getter for a header value
        inline std::string get_header(const std::string &key) const
        {
            auto it = headers.find(key);
            return (it != headers.end()) ? it->second : "";
        }

        // Getter for body
        inline std::string get_body() const { return body; }
    };

    inline Request *parse(const std::string &request_str)
    {
        auto request = new Request();
        std::istringstream stream(request_str);
        std::string line;

        // Parse the function name (first line)
        std::getline(stream, line);
        request->func_path = std::move(line);

        // Parse headers until an empty line is found
        while (std::getline(stream, line) && !line.empty())
        {
            auto colon_pos = line.find(':');
            if (colon_pos != std::string::npos)
            {
                std::string key = line.substr(0, colon_pos);
                std::string value = line.substr(colon_pos + 1);
                value.erase(0, value.find_first_not_of(" \t")); // Trim leading whitespace
                request->set_header(std::move(key), std::move(value));
            }
        }

        // Parse the body (remaining content after the empty line)
        request->body.assign((std::istreambuf_iterator<char>(stream)), std::istreambuf_iterator<char>());

        return request;
    }

} // namespace fcp

#endif // REQUEST_H
