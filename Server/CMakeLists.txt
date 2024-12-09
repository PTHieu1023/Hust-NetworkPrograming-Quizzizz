cmake_minimum_required(VERSION 3.26)
project(Server)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 17)

# Include all headers from the include/ directory
include_directories(src/)

# Find all .cpp files in the src/ directory (recursive)
file(GLOB_RECURSE SOURCES "src/*.cpp")

# Add subdirectory for the nlohmann_json library
add_subdirectory(external/json)

# Add the executable and specify all .cpp files
add_executable(HttpServerTemplate ${SOURCES})

# Link the nlohmann_json library
target_link_libraries(HttpServerTemplate PRIVATE nlohmann_json::nlohmann_json)
