#include "texture-page.h"
#include "sprite.h"

namespace Game {
    TexturePage::TexturePage(const std::string &file, SDL_Renderer &ren) {
        // read and process file
        SDL_Surface* surf = IMG_Load(file.c_str()); // TODO: make the texture
        if(surf == NULL) { throw "Unable to load image " + file; }
        SDL_Texture *tex = SDL_CreateTextureFromSurface(&ren, surf);
        SDL_FreeSurface(surf);
        if(tex == NULL) { throw "Could not convert " + file + " surface to texture"; }
        _texture = std::unique_ptr<SDL_Texture, decltype(& SDL_DestroyTexture)>(tex, SDL_DestroyTexture);
        // TODO: make the frames
    }

    Rectangle TexturePage::operator[](const int frame) const {
        return _frames.at(frame);
    }

    TexturePage::operator SDL_Texture * () const {
        return _texture.get();
    }

    bool TexturePage::hasSprite(const std::string & name) const {
        return !!_sprites.count(name);
    }

    Sprite TexturePage::make(const std::string & name) {
        return Sprite{*this, _sprites.at(name), name};
    }

    void TexturePage::setAlpha(Uint8 a) {
        SDL_SetTextureAlphaMod(_texture.get(), a);
    }

    void TexturePage::resetAlpha() { setAlpha(255); }

    void TexturePage::setBlend(Uint8 r, Uint8 g, Uint8 b) {
        SDL_SetTextureColorMod(_texture.get(), r, g, b);
    }
    void TexturePage::resetBlend() { setBlend(255, 255, 255); }
}
