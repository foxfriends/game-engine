#include "room.h"
#include "tilemap.h"
#include "drawable.h"

namespace Game {
    Room::Room(int id) : id{ id } {}
    void Room::attach(Engine * eng) {
        _eng = eng;
    }
    
    Room::~Room() {}
    void Room::start() {}
    void Room::proc(const Event &event) {
        for(auto &o : _objects) {
            o->proc(event);
        }
    }
    void Room::draw(Draw &draw) {
        for(auto &o : _objects) {
            if(auto d = dynamic_cast<const Drawable *>(o.get())) {
                d->draw(draw);
            }
        }
    }
    void Room::end() {}

    void Room::destroy(Object & who) {
        for(auto i = _objects.begin(); i != _objects.end(); ++i) {
            if(i->get() == &who) {
                _objects.erase(i);
                return;
            }
        }
        _eng->destroy(who);
    }

    bool Room::collides(const Rectangle & where) const {
        return _tilemap && _tilemap->collides(where);
    }

    Dimension Room::size() const {
        if(_tilemap) {
            return _tilemap->size();
        } else {
            return Dimension::infinite();
        }
    }
};
