#include "texture-page.h"

namespace Game {
    TexturePage::TexturePage(const std::string &file) {
        // read and process file
        SDL_Texture* tex; // TODO: make the texture
        _texture = std::unique_ptr<SDL_Texture, decltype(&SDL_DestroyTexture)>(tex, SDL_DestroyTexture);

        // TODO: make the frames
    }
    
    Rectangle TexturePage::operator[](const Key &img) const {
        return _images.at(img);
    }

    TexturePage::operator SDL_Texture*() const {
        return _texture.get();
    }
};
