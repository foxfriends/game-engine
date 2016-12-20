#ifndef __GAME_DRAWABLE_H__
#define __GAME_DRAWABLE_H__

#include <string>
#include <memory>
#include "draw.h"
#include "sprite.h"
#include "object.h"

namespace Game {
    class Drawable : public virtual Object {
        std::unique_ptr<Sprite> _sprite;
    public:
        bool has_sprite() const;
        Sprite & sprite();
        void sprite(const std::string & name);
        virtual void draw(Draw &draw) const = 0;
    };
}

#endif
