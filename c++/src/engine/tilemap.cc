#include "tilemap.h"

#include <cmath>

namespace Game {
    Dimension TileMap::size() const {
        return { static_cast<int>(_collisions[0].size()) * _tw, static_cast<int>(_collisions.size()) * _th };
    }

    bool TileMap::collides(const Rectangle & where) const {
        auto s = size();
        const int
            w = s.w,
            h = s.h,
            l = std::max(0, where.x / _tw),
            t = std::max(0, where.y / _th),
            r = std::min(static_cast<int>(std::ceil((where.x + where.w) / _tw)), w),
            b = std::min(static_cast<int>(std::ceil((where.y + where.h) / _th)), h);
        for(int i = t; i < b; ++i) {
            for(int j = l; j < r; ++j) {
                if(_collisions[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }
};
