cmake_minimum_required(VERSION 3.22)
project(Server)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 17)

# Include all headers from the include/ directory
include_directories(src/)

# Find the pqxx library using pkg-config
find_package(PkgConfig REQUIRED)
pkg_check_modules(PQXX REQUIRED libpqxx)

# Find all .cpp files in the src/ directory (recursive)
file(GLOB_RECURSE SOURCES "src/*.cpp")

# Add subdirectory for the nlohmann_json library
add_subdirectory(external/json)

# Add the executable and specify all .cpp files
add_executable(HttpServerTemplate ${SOURCES})

# Link the nlohmann_json header-only library
target_include_directories(HttpServerTemplate PRIVATE external/json/include)

# Include and link pqxx
target_include_directories(HttpServerTemplate PRIVATE ${PQXX_INCLUDE_DIRS})
target_link_libraries(HttpServerTemplate PRIVATE ${PQXX_LIBRARIES})
