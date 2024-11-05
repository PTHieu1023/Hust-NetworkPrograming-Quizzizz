#ifndef SERVER_H
#define SERVER_H

#include <sstream>
#include <arpa/inet.h>
#include <cstdio>
#include <sys/socket.h>
#include <netinet/in.h>
#include <functional>
#include <thread>
#include <unistd.h>
#include <memory>

namespace fcp::core
{
    using IPv4SocketAddress = struct sockaddr_in;
    using SocketAddress = struct sockaddr;

    class Server
    {
    private:
        IPv4SocketAddress address;
    public:
        Server() = default;
        ~Server() = default;
        void setConfig();
        void start(const std::function<void(Server *)> &callback);
    };

    inline void handle_connection(const int client_socket, SocketAddress socket_address, int addrlen) {
        printf("Connection established\n");
        char buffer[1024];
        std::ostringstream req_stream;
        while (recv(client_socket, buffer, sizeof(buffer), 0) > 0) {
            req_stream << buffer;
        }
        printf("Request received: %s\n", req_stream.str().c_str());
        close(client_socket);
    };

    inline void Server::start(const std::function<void(Server *)> &callback) {
        const int server_fd = socket(AF_INET, SOCK_STREAM, 0);
        if (server_fd < 0) {
            perror("Socket failed");
            exit(EXIT_FAILURE);
        }

        address.sin_family = AF_INET;
        address.sin_addr.s_addr = INADDR_ANY;
        address.sin_port = htons(8080);

        if (bind(server_fd, reinterpret_cast<SocketAddress*>(&address), sizeof(address)) < 0) {
            perror("Bind failed");
            exit(EXIT_FAILURE);
        }

        if(listen(server_fd, SOMAXCONN) < 0 ) {
            perror("Listen failed");
            exit(EXIT_FAILURE);
        }

        callback(this);

        while (true)
        {
            int addrlen;
            SocketAddress client_address;
            int client_socket = accept(server_fd, &client_address, reinterpret_cast<socklen_t *>(&addrlen));
            if (client_socket < 0)
                continue;
            std::thread clientThread([client_socket, client_address, addrlen]() {
                handle_connection(client_socket, client_address, addrlen);
            });
            clientThread.detach();
        }
        close(server_fd);
    }
}

#endif