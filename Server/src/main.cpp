#include <iostream>
#include <vector>
#include <cstring>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <thread>
#include <mutex>
#include <condition_variable>

const int BUFFER_SIZE = 1024;
const int HEADER_SIZE = 16;
const int WINDOW_SIZE = 4; // Sliding window size
const int PAYLOAD_SIZE = BUFFER_SIZE - HEADER_SIZE;

struct FrameHeader
{
    uint32_t message_id;
    uint32_t sequence_number;
    uint32_t payload_length;
    uint8_t flags; // 0 = normal frame, 1 = last frame
};

class Client
{
public:
    Client(const std::string &server_ip, int server_port, const std::string &message)
        : server_ip(server_ip), server_port(server_port), message(message) {}

    void sendLargeMessage()
    {
        // Create socket
        sockfd = socket(AF_INET, SOCK_STREAM, 0);
        struct sockaddr_in server_addr
        {
        };
        server_addr.sin_family = AF_INET;
        server_addr.sin_port = htons(server_port);
        inet_pton(AF_INET, server_ip.c_str(), &server_addr.sin_addr);

        // Connect to server
        if (connect(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
        {
            std::cerr << "Connection failed\n";
            return;
        }

        // Start sending frames
        int total_frames = (message.size() + PAYLOAD_SIZE - 1) / PAYLOAD_SIZE;
        int next_frame_to_send = 0;

        std::thread ack_thread(&Client::receiveAcknowledgments, this, total_frames);

        // Sliding window loop
        while (next_frame_to_send < total_frames)
        {
            std::unique_lock<std::mutex> lock(mutex);
            while (next_frame_to_send < acked_frame + WINDOW_SIZE && next_frame_to_send < total_frames)
            {
                sendFrame(next_frame_to_send++);
            }
            cv.wait(lock); // Wait for ACKs
        }

        ack_thread.join();
        close(sockfd);
    }

private:
    int sockfd;
    std::string server_ip;
    int server_port;
    std::string message;
    int acked_frame = 0;
    std::mutex mutex;
    std::condition_variable cv;

    void sendFrame(int sequence_number)
    {
        FrameHeader header;
        header.message_id = htonl(1); // Example message ID
        header.sequence_number = htonl(sequence_number);
        header.payload_length = htonl(std::min((int)message.size() - sequence_number * PAYLOAD_SIZE, PAYLOAD_SIZE));
        header.flags = (sequence_number == (message.size() / PAYLOAD_SIZE)) ? 1 : 0; // Last frame flag

        char buffer[BUFFER_SIZE];
        std::memcpy(buffer, &header, HEADER_SIZE);
        std::memcpy(buffer + HEADER_SIZE, message.c_str() + sequence_number * PAYLOAD_SIZE, ntohl(header.payload_length));

        send(sockfd, buffer, HEADER_SIZE + ntohl(header.payload_length), 0);
    }

    void receiveAcknowledgments(int total_frames)
    {
        int ack;
        while (acked_frame < total_frames)
        {
            int bytes_received = recv(sockfd, &ack, sizeof(int), 0);
            if (bytes_received > 0)
            {
                ack = ntohl(ack);
                std::unique_lock<std::mutex> lock(mutex);
                acked_frame = std::max(acked_frame, ack + 1);
                cv.notify_all();
            }
        }
    }
};

class Server
{
public:
    Server(int port) : port(port) {}

    void start()
    {
        int server_sock = socket(AF_INET, SOCK_STREAM, 0);
        struct sockaddr_in server_addr
        {
        };
        server_addr.sin_family = AF_INET;
        server_addr.sin_addr.s_addr = INADDR_ANY;
        server_addr.sin_port = htons(port);

        bind(server_sock, (struct sockaddr *)&server_addr, sizeof(server_addr));
        listen(server_sock, 1);

        std::cout << "Server listening on port " << port << "\n";
        int client_sock = accept(server_sock, nullptr, nullptr);

        std::thread ack_thread(&Server::sendAcknowledgments, this, client_sock);
        receiveFrames(client_sock);
        ack_thread.join();

        close(client_sock);
        close(server_sock);
    }

private:
    int port;
    std::mutex ack_mutex;
    int last_sequence_number = -1;

    void receiveFrames(int client_sock)
    {
        char buffer[BUFFER_SIZE];
        while (true)
        {
            int bytes_received = recv(client_sock, buffer, BUFFER_SIZE, 0);
            if (bytes_received <= 0)
                break;

            FrameHeader header;
            std::memcpy(&header, buffer, HEADER_SIZE);
            int sequence_number = ntohl(header.sequence_number);

            // Process frame payload (omitted for simplicity)
            {
                std::lock_guard<std::mutex> lock(ack_mutex);
                last_sequence_number = sequence_number;
            }
        }
    }

    void sendAcknowledgments(int client_sock)
    {
        while (true)
        {
            std::this_thread::sleep_for(std::chrono::milliseconds(100)); // ACK delay for demo

            int ack_number;
            {
                std::lock_guard<std::mutex> lock(ack_mutex);
                ack_number = last_sequence_number;
            }
            ack_number = htonl(ack_number);
            send(client_sock, &ack_number, sizeof(ack_number), 0);
        }
    }
};

int main()
{
    std::string message = "This is a large message that needs to be split into multiple frames for transmission over TCP.";
    int port = 8080;

    // Start server
    Server server(port);
    std::thread server_thread([&]()
                              { server.start(); });

    // Give server a moment to start
    std::this_thread::sleep_for(std::chrono::seconds(1));

    // Start client
    Client client("127.0.0.1", port, message);
    client.sendLargeMessage();

    server_thread.join();
    return 0;
}
