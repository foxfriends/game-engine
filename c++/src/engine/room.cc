#include "room.h"

namespace Game {
    Room::~Room() {}
    void Room::start() {}
    void Room::proc(const Event &event) {
        for(auto &o : _objects) {
            o->proc(event);
        }
    }
    void Room::draw(Draw &draw) {
        for(auto &o : _objects) {
            o->draw(draw);
        }
    }
    void Room::end() {}
};
