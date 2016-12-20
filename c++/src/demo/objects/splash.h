#ifndef __DEMO_OBJ_SPLASH_H__
#define __DEMO_OBJ_SPLASH_H__

#include "../../engine.h"

namespace Demo {
    class Splash : public virtual Game::Object, public Game::Drawable {
        int _fade = 0;
        int _duration = 4 * Game::SECOND;
        int _peak = 1 * Game::SECOND;
        float _alpha() const;
    public:
        virtual void keydown(int) override;
        virtual void step() override;
        virtual void draw(Game::Draw & draw) const override;
    };
}

#endif
