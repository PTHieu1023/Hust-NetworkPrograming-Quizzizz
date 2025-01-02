cmake_minimum_required(VERSION 3.20)
project(Server)

set(CMAKE_CXX_STANDARD 17)
include_directories(src/)

# Find required packages
find_package(PkgConfig REQUIRED)
pkg_check_modules(PQXX REQUIRED libpqxx)
find_package(OpenSSL REQUIRED)

# Find all source files
file(GLOB_RECURSE SOURCES "src/*.cpp")

# Add json library
add_subdirectory(external/json)

# Add executable
add_executable(Server ${SOURCES})

# Link libraries
target_include_directories(Server 
    PRIVATE external/json/include 
    PRIVATE ${PQXX_INCLUDE_DIRS}
)

target_link_libraries(Server 
    PRIVATE ${PQXX_LIBRARIES}
    PRIVATE OpenSSL::SSL 
    PRIVATE OpenSSL::Crypto
)