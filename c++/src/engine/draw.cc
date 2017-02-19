#include "draw.h"
#include "sprite.h"

namespace Game {
    Draw::Draw(SDL_Renderer & ren, const Dimension & dim) : _ren{ ren }, _view{ 0, 0, dim.w, dim.h }, _size{ dim } {
        SDL_SetRenderDrawBlendMode(&_ren, SDL_BLENDMODE_BLEND);
    }


    void Draw::load_font(const std::string & name, const std::string & path, int size) {
        if(_fonts.count(name) != 0) {
            close_font(name);
        }
        TTF_Font * font = TTF_OpenFont(path.c_str(), size);
        if(font == nullptr) {
            throw "Could not load font " + name + " from " + path;
        }
        _fonts.emplace(name, std::unique_ptr<TTF_Font, decltype(& TTF_CloseFont)>(font, TTF_CloseFont));
        if(!_font) {
            _font = _fonts.at(name).get();
        }
    }

    void Draw::close_font(const std::string & name) {
        _fonts.erase(name);
    }

    Draw & Draw::view(const Rectangle & port) {
        _view = port;
        return *this;
    }

    Draw & Draw::dimensions(const Dimension & dim) {
        _size = dim;
        return *this;
    }

    Draw & Draw::color(Uint8 r, Uint8 g, Uint8 b) {
        _r = r;
        _g = g;
        _b = b;
        return *this;
    }

    Draw & Draw::halign(const std::string & halign) {
        _halign = halign;
        return *this;
    }

    Draw & Draw::valign(const std::string & valign) {
        _valign = valign;
        return *this;
    }

    Draw & Draw::rotation(double angle, Position origin) {
        _angle = angle;
        _rotate_origin = origin;
        return *this;
    }

    Draw & Draw::alpha(float alpha) {
        _alpha = 255 * alpha;
        return *this;
    }

    Draw & Draw::font(const std::string & name) {
        try {
            _font = _fonts.at(name).get();
        } catch(std::out_of_range) {
            throw "Font " + name + " does not exist.";
        }
        return *this;
    }

    Draw & Draw::rect(Rectangle rect, int depth) {
        const Uint8
            r = _r,
            g = _g,
            b = _b,
            a = _alpha;
        _layers[depth].emplace_back(
            [this,rect,r,g,b,a] () -> void {
                SDL_Rect box = rect;
                // TODO: Move this calculation somewhere reusable
                box.x = (box.x - _view.x) * static_cast<float>(_size.w) / _view.w;
                box.y = (box.y - _view.y) * static_cast<float>(_size.h) / _view.h;
                box.w *= static_cast<float>(_size.w) / _view.w;
                box.h *= static_cast<float>(_size.h) / _view.h;
                SDL_SetRenderDrawColor(&_ren, r, g, b, a);
                SDL_RenderFillRect(&_ren, &box);
            }
        );
        return *this;
    }

    // Draw & Draw::circle(Circle circle, int depth) {
    //     const Uint8
    //         r = _r,
    //         g = _g,
    //         b = _b,
    //         a = _alpha;
    //     _layers[depth].emplace_back(
    //         [this,circle,r,g,b,a] () -> void {
    //             SDL_Rect box = rect;
    //             // TODO: Move this calculation somewhere reusable
    //             box.x = (box.x - _view.x) * static_cast<float>(_size.w) / _view.w;
    //             box.y = (box.y - _view.y) * static_cast<float>(_size.h) / _view.h;
    //             box.w *= static_cast<float>(_size.w) / _view.w;
    //             box.h *= static_cast<float>(_size.h) / _view.h;
    //             SDL_SetRenderDrawColor(&_ren, r, g, b, a);
    //             SDL_RenderFillRect(&_ren, &box);
    //         }
    //     );
    //     return *this;
    // }

    Draw & Draw::point(Position p, int depth) {
        const Uint8
            r = _r,
            g = _g,
            b = _b,
            a = _alpha;
        _layers[depth].emplace_back(
            [this,p,r,g,b,a] () -> void {
                Position q{ p };
                q.x = (q.x - _view.x) * static_cast<float>(_size.w) / _view.w;
                q.y = (q.y - _view.y) * static_cast<float>(_size.h) / _view.h;
                SDL_SetRenderDrawColor(&_ren, r, g, b, a);
                SDL_RenderDrawPoint(&_ren, q.x, q.y);
            }
        );
        return *this;
    }

    Draw & Draw::sprite(const Sprite & s, int depth) {
        const Uint8 a = _alpha;
        const double rotation = _angle;
        const Position origin = _rotate_origin;
        _layers[depth].emplace_back(
            [this,&s,a, rotation, origin] () -> void {
                SDL_Rect
                    src = s.src(),
                    dest = s.dest();
                dest.x = (dest.x - _view.x) * static_cast<float>(_size.w) / _view.w;
                dest.y = (dest.y - _view.y) * static_cast<float>(_size.h) / _view.h;
                dest.w *= static_cast<float>(_size.w) / _view.w;
                dest.h *= static_cast<float>(_size.h) / _view.h;
                s.texture().setAlpha(a);
                if(rotation == 0) {
                    SDL_RenderCopy(&_ren, s.texture(), &src, &dest);
                } else {
                    SDL_Point o = origin; // s.dest() - origin; which is it?
                    SDL_RenderCopyEx(&_ren, s.texture(), &src, &dest, rotation, &o, SDL_FLIP_NONE);
                }
                s.texture().resetAlpha();
            }
        );
        return *this;
    }

    // TODO: make this more efficient (don't make a new texture for static texts)
    // TODO: add alignment options to make this more sensible
    Draw & Draw::text(const std::string & str, Position pos, int depth) {
        const Uint8
            r = _r,
            g = _g,
            b = _b,
            a = _alpha;
        // TODO: consider uses of *_Solid, *_Shaded, and *_Blended in different cases
        auto surf = TTF_RenderText_Blended(_font, str.c_str(), { r, g, b, a });
        if(surf == nullptr) {
            // text failed to render, fail silently
            return *this;
        }
        const int
            w = surf->w,
            h = surf->h;
        auto tex = SDL_CreateTextureFromSurface(&_ren, surf);
        SDL_FreeSurface(surf);
        if(tex == nullptr) {
            // more fail = more fail
            return *this;
        }
        _layers[depth].emplace_back(
            [this,tex,pos,w,h] () -> void {
                SDL_Rect dest{pos.x, pos.y, w, h};
                dest.x = (dest.x - _view.x) * static_cast<float>(_size.w) / _view.w;
                dest.y = (dest.y - _view.y) * static_cast<float>(_size.h) / _view.h;
                dest.w *= static_cast<float>(_size.w) / _view.w;
                dest.h *= static_cast<float>(_size.h) / _view.h;
                SDL_RenderCopy(&_ren, tex, NULL, &dest);
                SDL_DestroyTexture(tex);
            }
        );
        return *this;
    }

    Dimension Draw::text_size(const std::string & str) {
        Dimension dim{0,0};
        if(TTF_SizeText(_font, str.c_str(), &dim.w, &dim.h) != 0) {
            throw "Draw::text_size - Could not measure size of string '" + str + "'";
        }
        return dim;
    }

    Draw & Draw::image( SDL_Texture * tex, const Rectangle & src, const Rectangle & dest, int depth) {
        _layers[depth].emplace_back(
            [this,tex,src,dest] () -> void {
                SDL_Rect from = src, to = dest;
                to.x = (to.x - _view.x) * static_cast<float>(_size.w) / _view.w;
                to.y = (to.y - _view.y) * static_cast<float>(_size.h) / _view.h;
                to.w *= static_cast<float>(_size.w) / _view.w;
                to.h *= static_cast<float>(_size.h) / _view.h;
                SDL_RenderCopy(&_ren, tex, &from, &to);
            }
        );
        return *this;
    }

    void Draw::clear() {
        SDL_SetRenderDrawColor(&_ren, 0xff, 0xff, 0xff, 0xff);
        SDL_RenderClear(&_ren);
    }

    void Draw::render() {
        for(auto & d : _layers) {
            for(auto & f : d.second) {
                f();
            }
        }
        _layers.clear();
    }

    void Draw::present() {
        SDL_RenderPresent(&_ren);
    }
}
