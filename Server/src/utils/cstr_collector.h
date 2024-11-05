#ifndef CSTR_SET_H
#define CSTR_SET_H

#include <set>

namespace utils
{
    // Comparator for const char* based on content, not memory address
    struct CStrComparator
    {
        bool operator()(const char *lhs, const char *rhs) const
        {
            return std::strcmp(lhs, rhs) < 0;
        }
    };
    using CStrSet = std::set<const char *, CStrComparator>;
    template <typename T>
    using CStrMap = std::map<const char *, T, CStrComparator>;
}

#endif