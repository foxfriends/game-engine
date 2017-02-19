#ifndef __GAME_DRAW_H__
#define __GAME_DRAW_H__

#include <SDL.h>
#include <SDL_ttf.h>

#include <functional>
#include <memory>
#include <string>
#include <vector>
#include <map>

#include "struct.h"

// a chained interface for drawing things
namespace Game {
    class Sprite;

    class Draw {
        Uint8 _r = 0xff, _g = 0xff, _b = 0xff;
        Uint8 _alpha = 0xff;
        std::string _halign = "left", _valign = "top";
        double _angle = 0;
        Position _rotate_origin{0, 0};
        std::map<int, std::vector<std::function<void()>>> _layers;
        SDL_Renderer & _ren;
        typedef void (FontDeleter) (TTF_Font *);
        std::map<std::string, std::unique_ptr<TTF_Font, FontDeleter*>> _fonts;
        TTF_Font * _font;
        Rectangle _view{ 0, 0, 0, 0 };
        Dimension _size{ 0, 0 };
    public:
        Draw(SDL_Renderer & _ren, const Dimension & dim);
        void load_font(const std::string & name, const std::string & path, int size);
        void close_font(const std::string & name);
        // what are these... should they be not public?
        Draw & dimensions(const Dimension & dim);
        Draw & view(const Rectangle & port);

        Draw & color(Uint8 r, Uint8 g, Uint8 b);
        Draw & alpha(float alpha);
        Draw & font(const std::string & name);
        Draw & halign(const std::string & halign);
        Draw & valign(const std::string & valign);
        Draw & rotation(double angle, Position origin = {0, 0});
        Draw & rect(Rectangle rect, int depth = 0);
        // Draw & circle(Circle circle, int depth = 0);
        Draw & point(Position pos, int depth = 0);
        Draw & sprite(const Sprite & sprite, int depth = 0);
        Draw & text(const std::string & str, Position pos, int depth = 0);
        Draw & image(SDL_Texture * image, const Rectangle & src, const Rectangle & dest, int depth = 0);

        Dimension text_size(const std::string & str);
        // what about these?
        void clear();
        void render();
        void present();
    };
}

#endif
