#include "fcp/request.h"

int main()
{
    const char *buffer = "/user/getAll\nContent-Length: 123\nData-Type: JSON\nAuthorization: fasgasdfsad\n\n{id: dasfsad, namwe: dasdsa}";
    const fcp::Request *req = fcp::parse(buffer);
    return 0;
}