#ifndef __GAME_ROOM_H__
#define __GAME_ROOM_H__

#include <memory>
#include <vector>

#include "engine.h"
#include "object.h"
#include "event.h"

namespace Game {
    class TileMap;
    class Room {
        std::vector<std::unique_ptr<Object>> _objects;
        std::unique_ptr<TileMap> _tilemap;
        std::string _tilemap_name;
        Engine * _eng = nullptr;
        std::vector<std::string> _texture_pages;
        std::vector<std::string> _sound;
        std::vector<std::string> _music;
    protected:
        Room();
    public:
        void attach(Engine * eng);
        const int id;
        Room(
            int id,
            const std::initializer_list<std::string> & textures = {},
            const std::initializer_list<std::string> & sound = {},
            const std::initializer_list<std::string> & music = {},
            const std::string & tilemap = "");
        virtual ~Room() = 0;
        // load the room
        virtual void load();
        // start the room
        virtual void start();
        // process an event
        virtual void proc(const Event &event);
        // draw all objects
        virtual void draw(Draw &draw);
        // end the room
        virtual void end();

        // game utilities
        GameUtility & game();

        template<typename T, typename ... Args>
        T * spawn(Args ... args);
        template<typename T>
        std::vector<T *> find() const;
        template<typename T>
        void destroy();
        void destroy(Object & who);

        template<typename T>
        bool collides(const Rectangle & where) const;
        bool collides(const Rectangle & where) const;
        Dimension size() const;

        TileMap * tilemap() const;
    };

    template<typename T, typename ... Args>
    T * Room::spawn(Args ... args) {
        if(T::persistent) {
            return _eng->spawn<T>(args ...);
        } else {
            _objects.emplace_back(std::make_unique<T>(args ...));
            _objects.back()->attach(_eng);
            _objects.back()->init();
        }
        return dynamic_cast<T *>(_objects.back().get());
    }

    template<typename T>
    std::vector<T *> Room::find() const {
        std::vector<T *> found = _eng->find<T>();
        for(auto & o : _objects) {
            if(auto t = dynamic_cast<T *>(o.get())) {
                found.emplace_back(t);
            }
        }
        return found;
    }

    template<typename T>
    void Room::destroy() {
        for(auto i = _objects.begin(); i != _objects.end();) {
            if(dynamic_cast<T *>(i->get())) {
                i = _objects.erase(i);
            } else {
                ++i;
            }
        }
        _eng->destroy<T>();
    }

    template<typename T>
    bool Room::collides(const Rectangle & where) const {
        for(auto &o : _objects) {
            if(auto b = dynamic_cast<const T *> (o.get())) {
                if(b->collides(where)) {
                    return true;
                }
            }
        }
        return false;
    }
}

#endif
