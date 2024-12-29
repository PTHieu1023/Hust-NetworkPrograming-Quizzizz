#ifndef PASSWORD_H
#define PASSWORD_H

#include <string>
#include <openssl/evp.h>
#include <iomanip>
#include <sstream>
#include <stdexcept>

namespace utils::password {
    inline std::string hash_password(const std::string& password) {
        EVP_MD_CTX* ctx = EVP_MD_CTX_new(); // Create a context for hashing
        if (!ctx) throw std::runtime_error("Failed to create hash context.");

        const EVP_MD* md = EVP_sha256(); // Use SHA-256 algorithm
        if (EVP_DigestInit_ex(ctx, md, nullptr) != 1) {
            EVP_MD_CTX_free(ctx);
            throw std::runtime_error("Failed to initialize digest.");
        }

        if (EVP_DigestUpdate(ctx, password.c_str(), password.size()) != 1) {
            EVP_MD_CTX_free(ctx);
            throw std::runtime_error("Failed to update digest.");
        }

        unsigned char hash[EVP_MAX_MD_SIZE];
        unsigned int length = 0;
        if (EVP_DigestFinal_ex(ctx, hash, &length) != 1) {
            EVP_MD_CTX_free(ctx);
            throw std::runtime_error("Failed to finalize digest.");
        }

        EVP_MD_CTX_free(ctx); // Clean up context

        // Convert hash to hexadecimal string
        std::stringstream ss;
        for (unsigned int i = 0; i < length; i++) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(hash[i]);
        }
        return ss.str();
    }
}

#endif //PASSWORD_H
