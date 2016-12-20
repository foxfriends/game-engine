#include "room.h"
#include "tilemap.h"
#include "drawable.h"

namespace Game {
    std::vector<std::string> Room::texture_pages {};

    Room::Room(int id, const std::string & tilemap) : _tilemap_name{ tilemap }, id{ id } { }

    void Room::attach(Engine * eng) {
        _eng = eng;
        if(_tilemap_name != "") {
            _tilemap = std::make_unique<TileMap>(_eng->tilemap(_tilemap_name), _eng->texture());
        }
    }

    Room::~Room() {}
    void Room::start() {}
    void Room::proc(const Event &event) {
        for(auto &o : _objects) {
            o->proc(event);
        }
    }
    void Room::draw(Draw &draw) {
        if(_tilemap) {
            _tilemap->draw(draw);
        }
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

    TileMap * Room::tilemap() const {
        return _tilemap.get();
    }
}
