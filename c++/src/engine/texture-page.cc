#include "texture-page.h"
#include "sprite.h"
#include <algorithm>
#include <fstream>

namespace Game {
    TexturePage::TexturePage(const std::string &file, SDL_Renderer &ren) {
        // read and process file
        std::ifstream fin{ file };
        json data;
        fin >> data;
        _size = Dimension{ data["width"], data["height"] };
        _sprites = data["sprites"];
        _frames.clear();
        _frames.reserve(data["frames"].size());
        std::transform(
            data["frames"].begin(),
            data["frames"].end(),
            std::back_inserter(_frames),
            [] (const json & v) -> Rectangle {
                return { v[0], v[1], v[2], v[3] };
            }
        );
        std::string image = data["image"].get<std::string>();
        SDL_Surface* surf = IMG_Load(image.c_str());
        if(surf == NULL) {
            throw "Unable to load image " + image;
        }
        SDL_Texture *tex = SDL_CreateTextureFromSurface(&ren, surf);
        SDL_FreeSurface(surf);
        if(tex == NULL) { throw "Could not convert " + file + " surface to texture"; }
        _texture = std::unique_ptr<SDL_Texture, decltype(& SDL_DestroyTexture)>(tex, SDL_DestroyTexture);
    }

    Rectangle TexturePage::operator[](const int frame) const {
        return _frames.at(frame);
    }

    TexturePage::operator SDL_Texture * () const {
        return _texture.get();
    }

    Dimension TexturePage::size() const {
        return _size;
    }

    bool TexturePage::hasSprite(const std::string & name) const {
        return _sprites.count(name);
    }

    std::unique_ptr<Sprite> TexturePage::make(const std::string & name) {
        return std::make_unique<Sprite>(*this, _sprites[name], name);
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
