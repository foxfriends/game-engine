#include "drawable.h"
#include "game-utility.h"

namespace Game {
    Drawable::~Drawable() {}

    bool Drawable::has_sprite() const {
        return !!_sprite;
    }

    Sprite & Drawable::sprite() {
        return *_sprite;
    }

    const Sprite & Drawable::sprite() const {
        return *_sprite;
    }

    void Drawable::sprite(const std::string & name) {
        if(!_sprite || name != _sprite->name()) {
            Position where{ 0, 0 };
            if(_sprite) {
                where = _sprite->dest();
            }
            _sprite = game().make_sprite(name);
            _sprite->x = where.x;
            _sprite->y = where.y;
        }
    }

    void Drawable::draw(Draw & draw) const {
        if(_sprite) {
            draw.sprite(*_sprite.get());
        }
    }
}
