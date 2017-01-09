#include "texture-manager.h"
#include "sprite.h"

namespace Game {
    TextureManager::TextureManager(SDL_Renderer & ren, std::map<std::string, std::string> & sources)
        : _sources{ sources }, _ren{ ren } {}

    void TextureManager::load(const std::vector<std::string> & textures) {
        for(const std::string & name : textures) {
            if(!_pages.count(name)) {
                try {
                    _pages[name] = std::make_unique<TexturePage>(_sources[name], _ren);
                } catch( std::string err ) {
                    throw;
                } catch( ... ) {
                    throw "Could not load texture page " + name;
                }
            }
            ++_references[name];
        }
    }

    void TextureManager::purge(const std::vector<std::string> & textures) {
        for(const std::string & name : textures) {
            if(_references[name]) {
                if(!--_references[name]) {
                    _pages.erase(name);
                }
            }
        }
    }

    std::unique_ptr<Sprite> TextureManager::sprite(const std::string & name) {
        for(auto & page : _pages) {
            if(page.second->hasSprite(name)) {
                return page.second->make(name);
            }
        }
        throw "Sprite " + name + " does not exist in the current set of texture pages!s";
    }

    TexturePage & TextureManager::texture(const std::string & name) {
        if(!_pages.count(name)) {
            throw "No texture page named " + name + " exists";
        }
        return *_pages[name];
    }
}
