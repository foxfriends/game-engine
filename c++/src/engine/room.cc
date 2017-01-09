#include "room.h"
#include "tilemap.h"
#include "drawable.h"

namespace Game {
    Room::Room(int id, const std::initializer_list<std::string> & textures, const std::string & tilemap)
        : _tilemap_name{ tilemap }, texture_pages{ textures }, id{ id } { }

    void Room::attach(Engine * eng) {
        _eng = eng;
        if(_tilemap_name != "") {
            _tilemap = std::make_unique<TileMap>(_eng->tilemap(_tilemap_name), _eng->texture());
            _eng->texture().load(_tilemap->textures());
            _tilemap->render(_eng->renderer());
        }
        _eng->texture().load(texture_pages);
    }

    Room::~Room() {
        _eng->texture().purge(texture_pages);
    }
    void Room::load() {}
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
            return { _eng->size().w, _eng->size().h };
        }
    }

    TileMap * Room::tilemap() const {
        return _tilemap.get();
    }
}
