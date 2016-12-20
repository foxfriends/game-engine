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
    class TextureManager;
    class TexturePage;
    class TileMap {
        int _tw, _th;
        TextureManager & _tm;
        typedef void (TextureDeleter) (SDL_Texture *);
        std::map<int, std::unique_ptr<SDL_Texture, TextureDeleter *>> _layers;
        std::map<int, std::vector<std::vector<int>>> _images;
        std::vector<std::vector<bool>> _collisions;
        std::vector<std::string> _texture_pages;
        std::vector<std::pair<int, int>> _indexmap;
        std::pair<TexturePage *, Rectangle> tile_from_index(int i) const;
    public:
        TileMap(const std::string & file, TextureManager & texture);
        const std::vector<std::string> & textures() const;
        Dimension size() const;
        void render(SDL_Renderer * ren);
        void draw(Draw & draw) const;
        bool collides(const Rectangle & where) const;
    };
}

#endif
