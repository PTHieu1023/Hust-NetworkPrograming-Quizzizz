#ifndef SERVER_H
#define SERVER_H

#include <iostream>
#include <sys/epoll.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <fcntl.h>
#include <unordered_map>
#include <vector>
#include <functional>

#include "fcp/core/context.h"

#define MAX_EVENTS 100
#define BUFFER_SIZE 4096
#define PORT 8080
namespace fcp {
    class Server{
    public:
        explicit Server(const int port) : port_(port), server_socket_(-1), epoll_fd_(-1) {}
        ~Server()
        {
            if (server_socket_ != -1)
                close(server_socket_);
            if (epoll_fd_ != -1)
                close(epoll_fd_);
        }

        void start();
        Server* use(int16_t opcode,const std::function<void(Context*)>& handler);

    private:
        int port_;
        int server_socket_;
        int epoll_fd_;

        std::unordered_map<int16_t, std::function<void(Context*)>> handlers_map_;

        void handle_new_connection() const;
        void handle_client_data(int client_socket);
    };


    inline void Server::start()
    {
        // Tạo socket
        server_socket_ = socket(AF_INET, SOCK_STREAM, 0);
        if (server_socket_ < 0)
        {
            perror("Socket creation failed");
            return;
        }

        sockaddr_in server_addr{};
        server_addr.sin_family = AF_INET;
        server_addr.sin_addr.s_addr = INADDR_ANY;
        server_addr.sin_port = htons(port_);

        if (bind(server_socket_, reinterpret_cast<struct sockaddr *>(&server_addr), sizeof(server_addr)) < 0)
        {
            perror("Bind failed");
            close(server_socket_);
            return;
        }

        if (listen(server_socket_, 10) < 0)
        {
            perror("Listen failed");
            close(server_socket_);
            return;
        }

        std::cout << "Server listening on port " << port_ << std::endl;

        const int flags = fcntl(server_socket_, F_GETFL, 0);
        fcntl(server_socket_, F_SETFL, flags | O_NONBLOCK);

        epoll_fd_ = epoll_create1(0);
        if (epoll_fd_ < 0)
        {
            perror("Epoll creation failed");
            close(server_socket_);
            return;
        }

        epoll_event ev{};
        ev.events = EPOLLIN;
        ev.data.fd = server_socket_;
        if (epoll_ctl(epoll_fd_, EPOLL_CTL_ADD, server_socket_, &ev) < 0)
        {
            perror("Failed to add server socket to epoll");
            close(server_socket_);
            close(epoll_fd_);
            return;
        }

        std::vector<epoll_event> events(MAX_EVENTS);

        while (true)
        {
            const int event_count = epoll_wait(epoll_fd_, events.data(), MAX_EVENTS, -1);
            if (event_count < 0)
            {
                perror("Epoll wait failed");
                break;
            }

            for (int i = 0; i < event_count; ++i)
            {
                if (events[i].data.fd == server_socket_)
                    handle_new_connection();
                else
                    handle_client_data(events[i].data.fd);
            }
        }
    }

    inline Server * Server::use(const int16_t opcode,const std::function<void(Context *)> &handler) {
        if (handlers_map_.find(opcode) != handlers_map_.end())
            throw std::invalid_argument("Opcode has been used");
        this->handlers_map_[opcode] = handler;
        return this;
    }

    inline void Server::handle_new_connection() const
    {
        sockaddr_in client_addr{};
        socklen_t client_len = sizeof(client_addr);
        int client_socket = accept(server_socket_, reinterpret_cast<struct sockaddr *>(&client_addr), &client_len);
        if (client_socket < 0)
        {
            perror("Accept failed");
            return;
        }

        const int flags = fcntl(client_socket, F_GETFL, 0);
        fcntl(client_socket, F_SETFL, flags | O_NONBLOCK);

        // Thêm client socket vào epoll
        epoll_event ev{};
        ev.events = EPOLLIN | EPOLLET;
        ev.data.fd = client_socket;
        if (epoll_ctl(epoll_fd_, EPOLL_CTL_ADD, client_socket, &ev) < 0)
        {
            perror("Failed to add client socket to epoll");
            close(client_socket);
            return;
        }

        // TODO: Create new session

        std::cout << "New connection accepted: " << client_socket << std::endl;
    }

    inline void Server::handle_client_data(int client_socket)
    {
        try {
            char buffer[BUFFER_SIZE];
            while (true) {
                const ssize_t bytes_read = read(client_socket, buffer, sizeof(buffer) - 1);
                if (bytes_read < 0)
                {
                    if (errno == EAGAIN || errno == EWOULDBLOCK)
                    {
                        break;
                    }
                    perror("Read failed");
                    close(client_socket);
                    return;
                }
                else if (bytes_read == 0)
                {
                    std::cout << "Client disconnected: " << client_socket << std::endl;
                    // TODO: Clear session
                    close(client_socket);
                    return;
                }
                buffer[bytes_read] = '\0';

                std::cout << "Received from client " << client_socket << ": " << buffer << std::endl;
                int16_t opcode = buffer[1] << 8 | buffer[0];
                std::string payload(buffer + 2);
                // TODO: Handle client request
                const auto ctx = std::make_unique<Context>(client_socket, payload);
                this->handlers_map_[opcode](ctx.get());
            }
        }catch (std::exception &e) {
            std::cout << e.what() << std::endl;
            write(client_socket, e.what(), sizeof(e.what()));
        }
    }

}

#endif