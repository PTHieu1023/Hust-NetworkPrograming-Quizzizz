cmake_minimum_required(VERSION 3.26)
project(Server)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 17)
# include all headers from the include/ directory
include_directories(src/)

# Find all .cpp files in the src/ directory (non-recursive)
file(GLOB_RECURSE SOURCES "src/*.cpp")

# Add the executable and specify all .cpp files
add_executable(HttpServerTemplate ${SOURCES})
