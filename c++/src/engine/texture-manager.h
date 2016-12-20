#ifndef __GAME_TEXTURE_MANAGER_H__
#define __GAME_TEXTURE_MANAGER_H__

#include <vector>
#include <string>
#include <memory>
#include <map>
#include <SDL.h>

#include "texture-page.h"

namespace Game {
    class Sprite;

    class TextureManager {
        std::map<std::string, std::unique_ptr<TexturePage>> _pages;
        std::vector<std::string> _old;
        std::map<std::string, std::string> _sources;
        SDL_Renderer &_ren;
    public:
        TextureManager(SDL_Renderer & ren, std::map<std::string, std::string> && sources);
        // load a list of texture pages
        void load(const std::vector<std::string> & textures);
        // remove all old texture pages
        void purge();
        // remove all texture pages in the list
        void purge(const std::vector<std::string> & textures);
        // make a sprite from the current set of pages
        Sprite sprite(const std::string & name);
    };
}

#endif
