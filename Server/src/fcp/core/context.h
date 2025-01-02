#ifndef CONTEXT_H
#define CONTEXT_H

#include <string>
#include <unistd.h>

#include <nlohmann/json.hpp>

namespace fcp {
    class Context
    {
    private:
        nlohmann::json props;
        int client_socket;
    public:
        Context(int client_socket, const std::string& json_string);
        ~Context() = default;
        nlohmann::json getProps(const std::string &key) const;
        void writeClient(const std::string &buffer) const;
    };
}// namespace fcp::core

#endif