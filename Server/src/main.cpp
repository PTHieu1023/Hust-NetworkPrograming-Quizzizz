#include "fcp/request.h"

int main()
{
    const char *buffer = "/user/getAll\nContent-Length: 123\nContent-Type: JSON\nAuthorization: fasgasdfsad\n\n{id: dasfsad, namwe: dasdsa}";
    auto req = fcp::request::Request::parse(buffer);
    auto str = req.get()->deparse();
    auto req2 = fcp::request::Request::parse(str);
    return 0;
}