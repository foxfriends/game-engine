#ifndef __GAME_OBJECT_H__
#define __GAME_OBJECT_H__

#include <memory>
#include <vector>

#include "drawable.h"
#include "struct.h"
#include "event.h"

namespace Game {
    class Object : public Drawable {
    public:
        virtual ~Object() = 0;
        // potential events to trigger (in step-chronological order)
        // occurs only once per room
        virtual void roomstart();
        // occurs before inputs are processed
        virtual void prestep();
        // process each inputs
        virtual void keydown(const int which);
        virtual void mousedown(const int which);
        virtual void keyup(const int which);
        virtual void mouseup(const int which);
        virtual void mousemove(const Position &where);
        // occurs after inputs are processed
        virtual void step();
        // occurs after all objects have moved once
        virtual void stepend();
        // occurs only once per room
        virtual void roomend();
        // general handle to process an event
        void proc(const Event &data);
    };
};

#endif
