#include "draw.h"
#include "sprite.h"

namespace Game {
    Draw::Draw(SDL_Renderer & ren) : _ren{ ren } {
        SDL_SetRenderDrawBlendMode(&_ren, SDL_BLENDMODE_BLEND);
    }

    Draw & Draw::color(Uint8 r, Uint8 g, Uint8 b) {
        _r = r;
        _g = g;
        _b = b;
        return *this;
    }

    Draw & Draw::alpha(float alpha) {
        _alpha = 255 * alpha;
        return *this;
    }

    Draw & Draw::font(const std::string & name) {
        _font = _fonts.at(name).get();
        return *this;
    }

    Draw & Draw::rect(const Rectangle rect, int depth) {
        const Uint8
            r = _r,
            g = _g,
            b = _b,
            a = _alpha;
        _layers[depth].emplace_back(
            [this,rect,r,g,b,a] () -> void {
                SDL_Rect box = rect;
                SDL_SetRenderDrawColor(&_ren, r, g, b, a);
                SDL_RenderFillRect(&_ren, &box);
            }
        );
        return *this;
    }

    Draw & Draw::point(const Position p, int depth) {
        const Uint8
            r = _r,
            g = _g,
            b = _b,
            a = _alpha;
        _layers[depth].emplace_back(
            [this,p,r,g,b,a] () -> void {
                SDL_SetRenderDrawColor(&_ren, r, g, b, a);
                SDL_RenderDrawPoint(&_ren, p.x, p.y);
            }
        );
        return *this;
    }

    Draw & Draw::sprite(const Sprite & s, int depth) {
        const Uint8 a = _alpha;
        _layers[depth].emplace_back(
            [this,&s,a] () -> void {
                SDL_Rect
                    src = s.src(),
                    dest = s.dest();
                s.texture().setAlpha(a);
                SDL_RenderCopy(&_ren, s.texture(), &src, &dest);
                s.texture().resetAlpha();
            }
        );
        return *this;
    }

    // TODO: make this more efficient (don't make a new texture for static texts)
    // TODO: add alignment options to make this more sensible
    // TODO: add ability to check text sizes
    Draw & Draw::text(const std::string & str, const Position & pos, int depth) {
        const Uint8
            r = _r,
            g = _g,
            b = _b,
            a = _alpha;
        auto surf = TTF_RenderText_Solid(_font, str.c_str(), { r, g, b, a});
        if(surf == nullptr) {
            // text failed to render, fail silently
            return *this;
        }
        const int
            w = surf->w,
            h = surf->h;
        auto tex = SDL_CreateTextureFromSurface(&_ren, surf);
        if(tex == nullptr) {
            // more fail = more fail
            return *this;
        }
        auto text = std::unique_ptr<SDL_Texture, decltype(& SDL_DestroyTexture)>(tex, SDL_DestroyTexture);
        _layers[depth].emplace_back(
            [this,&text,&pos,w,h] () -> void {
                SDL_Rect dest{pos.x, pos.y, w, h};
                SDL_RenderCopy(&_ren, text.get(), NULL, &dest);
            }
        );
        return *this;
    }

    void Draw::render() {
        SDL_SetRenderDrawColor(&_ren, 0xff, 0xff, 0xff, 0xff);
        SDL_RenderClear(&_ren);
        for(auto & d : _layers) {
            for(auto & f : d.second) {
                f();
            }
        }
        SDL_RenderPresent(&_ren);
        _layers.clear();
    }
};
