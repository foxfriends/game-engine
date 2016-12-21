#ifndef __DEMO_OBJ_PLAYER_H__
#define __DEMO_OBJ_PLAYER_H__

#include "../../engine.h"

namespace Demo {
    class Player : public virtual Game::Object, public Game::Drawable, public Game::Collider {
    public:
        static bool persistent;
    private:
        const int _speed = 4;
        int _hsp = 0, _vsp = 0;
        std::string _dir = "south";
    public:
        virtual void init() override;
        virtual void roomend(int, int next) override;
        virtual void keydown(int key) override;
        virtual void step() override;
        virtual void stepend() override;

        virtual Game::Position position() const override;
        virtual Game::Rectangle bbox() const override;
    };
}

#endif
