#include "drawable.h"
#include "game-utility.h"

namespace Game {
    bool Drawable::has_sprite() const {
        return !!_sprite;
    }

    Sprite & Drawable::sprite() {
        return *_sprite;
    }

    void Drawable::sprite(const std::string & name) {
        _sprite = game().make_sprite(name);
    }
}
