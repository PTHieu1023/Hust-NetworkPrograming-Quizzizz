#include "context.h"

using namespace fcp;

Context::Context(int client_socket, const std::string& json_string) {
    this->client_socket = client_socket;
    this->props = nlohmann::json::parse(json_string);
}

std::string Context::getProps(const std::string &key) const{
    if (props.find(key) == props.end()) {
        return nullptr;
    }
    return props[key];
}

void Context::writeClient(const std::string &buffer) const {
    write(client_socket, buffer.c_str(), buffer.size());
}