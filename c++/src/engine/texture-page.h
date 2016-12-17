#ifndef __GAME_TEXTURE_PAGE_H__
#define __GAME_TEXTURE_PAGE_H__

#include <memory>
#include <string>
#include <vector>
#include <map>

#include <SDL.h>
#include <SDL_image.h>

#include "struct.h"

namespace Game {
    // a TexturePage maps out specific images
    class Sprite;
    class TexturePage {
        typedef void (Deleter) (SDL_Texture *);
        std::unique_ptr<SDL_Texture, Deleter *> _texture{ nullptr, SDL_DestroyTexture };
        std::map<std::string, std::vector<int>> _sprites;
        std::map<int, Rectangle> _frames;
    public:
        // creates the TexturePage based on the texture page file given
        TexturePage(const std::string &file, SDL_Renderer &ren);
        // image boundary access (may throw std::out_of_range)
        Rectangle operator[](const int img) const;
        // check if this page has an entry for some sprite
        bool hasSprite(const std::string & name) const;
        // create a sprite from this page
        Sprite make(const std::string & name) const;
        // texture access
        operator SDL_Texture * () const;
    };
};

#endif
