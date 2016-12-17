#include "texture-manager.h"
#include "sprite.h"

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

    void TextureManager::purge() {
        purge(_old);
    }

    void TextureManager::purge(const std::vector<std::string> & textures) {
        for(auto & texture : textures) {
            _pages.erase(texture);
        }
    }

    Sprite TextureManager::sprite(const std::string & name) {
        for(auto & page : _pages) {
            if(page.second->hasSprite(name)) {
                return page.second->make(name);
            }
        }
        throw "Sprite " + name + " does not exist in the current set of texture pages!s";
    }
};
