# Development instruction
## 1. Project structure
- external: Third-party library (json, etc...)
- src: Source code of project
- src/fcp/core: Base server build (Don't do anything here)
- handler: Controller layer in MVC
- models: Model layer in MVC
- services: Service layer in MVC

## 2. How to make an api
- Define model
- Implement service: If work with DB call fcp::DB::getInstance()->getConnection() to get connection instance of database.
[Database material](https://pqxx.org/libpqxx/)
- Implement controller -> Cast data type into json string then send back to client