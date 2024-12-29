#ifndef PASSWORD_H
#define PASSWORD_H

#include <string>
#include <openssl/sha.h>
#include <iomanip>
#include <sstream>

namespace services::utils {
    inline std::string hash_password(const std::string& password) {
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        SHA256_Update(&sha256, password.c_str(), password.size());
        SHA256_Final(hash, &sha256);

        std::stringstream ss;
        for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(hash[i]);
        }
        return ss.str();
    }

    inline bool verify_password(const std::string& password, const std::string& hashed_password) {
        return hash_password(password) == hashed_password;
    }
}

#endif //PASSWORD_H
