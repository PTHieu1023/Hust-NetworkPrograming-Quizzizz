#ifndef CONTEXT_H
#define CONTEXT_H

#include <string>

#include <nlohmann/json.hpp>

namespace fcp
{
    class Context
    {
    private:
        nlohmann::json props;
        int client_socket;
    public:
        Context(int client_socket, const std::string& json_string);
        ~Context() = default;
        std::string getProps(const std::string &key) const;
        void writeClient(const std::byte* buffer, int size) const;
    };

    inline Context::Context(int client_socket, const std::string& json_string) {
        this->client_socket = client_socket;
        this->props = nlohmann::json::parse(json_string);
    }

    inline std::string Context::getProps(const std::string &key) const {
        return this->props[key];
    }

    inline void Context::writeClient(const std::byte *buffer, int size) const {
        write(client_socket, buffer, size);
    }
}// namespace fcp::core

#endif