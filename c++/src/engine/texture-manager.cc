#include "texture-manager.h"

namespace Game {
    TextureManager::TextureManager(SDL_Renderer & ren, std::map<std::string, std::string> && sources)
        : _sources{ sources }, _ren{ ren } {}

    void TextureManager::load(const std::vector<std::string> & textures) {
        for(const std::string & name : textures) {
            if(!_pages.count(name)) {
                _pages[name] = std::make_unique<TexturePage>(name, _ren);
            }
        }
    }
};
