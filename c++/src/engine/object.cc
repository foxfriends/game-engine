#include "object.h"

namespace Game {
    Object::~Object() {}

    void roomstart() {}

    void stepstart() {}

    void mousemove(const Position &where) {}
    void keydown(const int which) {}
    void mousedown(const int which) {}
    void keyup(const int which) {}
    void mouseup(const int which) {}

    void step() {}
    void stepend() {}

    void roomend() {}

    void proc(const Event &data) {
        // process an event..?
    }
};
