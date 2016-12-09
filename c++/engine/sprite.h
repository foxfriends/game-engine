#ifndef __GAME_SPRITE_H__
#define __GAME_SPRITE_H__

#include <string>
#include <sdl_image.h>

#include "struct.h"

namespace Game {
  class Sprite : public Rectangle {
    std::shared_ptr<SDL_Texture> _texture;
    std::vector<Rectangle> _frames;
  public:
    // single frame
    Sprite(std::string file);
    // strip
    Sprite(std::string file, int f);
    // grid
    Sprite(std::string file, int c, int r);
    // abstract
    Sprite(std::string file, int f, Rectangle... framelist)
    virtual ~Sprite();

    // update
    int frame() const;
    int frame(int frame);

    // update and access
    Sprite & operator[](int frame);

    // access
    virtual operator SDL_Texture *() const;
  };
};

#endif
