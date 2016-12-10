#ifndef __GAME_TEXTURE_PAGE_H__
#define __GAME_TEXTURE_PAGE_H__

#include <string>
#include <memory>
#include <map>

#include <SDL.h>
#include <SDL_image.h>

#include "struct.h"

namespace Game {
    // a TexturePage maps out specific images
    class TexturePage final {
    public:
        typedef int Key;
    private:
        typedef void (Deleter) (SDL_Texture*);
        std::unique_ptr<SDL_Texture, Deleter*> _texture{nullptr, SDL_DestroyTexture};
        std::map<Key, Rectangle> _images;
    public:
        // creates the TexturePage based on the texture page file given
        TexturePage(const std::string &file);
        // image boundary access (may throw std::out_of_range)
        Rectangle operator[](const Key &img) const;
        // texture access
        operator SDL_Texture*() const;
    };
};

#endif
