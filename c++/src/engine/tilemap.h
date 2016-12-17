#ifndef __GAME_TILEMAP_H__
#define __GAME_TILEMAP_H__

#include <vector>
#include <string>
#include <memory>
#include <map>
#include <SDL.h>

#include "draw.h"
#include "struct.h"

namespace Game {
    class TileMap {
        int _tw, _th;
        typedef void (Deleter) (SDL_Texture *);
        std::map<int, std::unique_ptr<SDL_Texture, Deleter *>> _images;
        std::vector<std::vector<bool>> _collisions;
    public:
        TileMap(std::string file);
        Dimension size() const;
        void draw(Draw &draw) const;
        bool collides(const Rectangle & where) const;
    };
};

#endif
