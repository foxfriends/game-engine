#ifndef __GAME_TEXTURE_PAGE_H__
#define __GAME_TEXTURE_PAGE_H__

#include <memory>
#include <string>
#include <vector>
#include <map>

#include <SDL.h>
#include <SDL_image.h>
#include <json.hpp>
using nlohmann::json;

#include "struct.h"

namespace Game {
    // a TexturePage maps out specific images
    class Sprite;
    class TexturePage {
        Dimension _size{ 0, 0 };
        typedef void (TextureDeleter) (SDL_Texture *);
        std::unique_ptr<SDL_Texture, TextureDeleter *> _texture{ nullptr, SDL_DestroyTexture };
        std::vector<Rectangle> _frames;
        json _sprites;
    public:
        // creates the TexturePage based on the texture page file given
        TexturePage(const std::string &file, SDL_Renderer &ren);
        // frame access
        Rectangle operator[](const int img) const;
        // check if this page has an entry for some sprite
        bool hasSprite(const std::string & name) const;
        // create a sprite from this page
        std::unique_ptr<Sprite> make(const std::string & name);
        // texture access
        operator SDL_Texture * () const;

        Dimension size() const;
        // operations required for blending
        void setAlpha(Uint8 a);
        void resetAlpha();
        void setBlend(Uint8 r, Uint8 g, Uint8 b);
        void resetBlend();
    };
}

#endif
