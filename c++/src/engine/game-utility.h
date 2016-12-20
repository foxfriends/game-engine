#ifndef __GAME_UTILITY_H__
#define __GAME_UTILITY_H__

#include "struct.h"
#include "room.h"
#include "tilemap.h"

namespace Game {
    class Collider;
    class Engine;
    class Object;

    class GameUtility {
        Engine &_eng;
    public:
        GameUtility(Engine &eng);

        // viewport
        Rectangle &view() const;
        void view(const Rectangle & v, bool constrain = true);
        void view(const Position & v, bool constrain = true);

        // room utilities
        template<typename T>
        void room_goto();
        template<typename T>
        void room_overlay();
        void room_close();

        // input
        bool mousestate(int button);
        bool keystate(int key);

        // game state
        void end();
        void restart();

        // objects
        template<typename T, typename ... Args>
        void spawn(Args ... args);
        void destroy(Object & who);
        // any (including room)
        bool collides(const Rectangle & where) const;
        // specific collider
        template<typename T>
        bool collides(const Rectangle & where) const;
        // a specific instance
        bool collides(const Rectangle & where, const Collider & who) const;
        // the room only
        bool collides_room(const Rectangle & where) const;

        // sprites
        std::unique_ptr<Sprite> make_sprite(const std::string & name);
    };

    template<typename T>
    void GameUtility::room_goto() {
        std::unique_ptr<Room> rm = std::make_unique<T>();
        rm->attach(&_eng);
        auto d = rm->size();
        Rectangle newview{ 0, 0, d.w, d.h };
        int prevId = -1;
        if(!_eng._rooms.empty()) {
            auto &old = _eng._rooms.back();
            prevId = old->id;
            // end the previous room
            _eng.proc(Event{ Event::RoomEnd, { prevId, rm->id } });
            old->end();
            _eng._rooms.back() = std::move( rm );
            _eng._objects.back() = std::vector<std::unique_ptr<Object>>{};
            _eng._views.back() = newview;
        } else {
            _eng._rooms.emplace_back(std::move( rm ));
            _eng._objects.emplace_back();
            _eng._views.emplace_back(newview);
        }

        auto textures = T::texture_pages;
        auto tm = _eng._rooms.back()->tilemap();
        if(tm) {
            auto tilemap_textures = tm->textures();
            textures.insert(textures.end(), tilemap_textures.begin(), tilemap_textures.end());
        }

        // TODO: figure out asynchronous loading
        //       is this something to do with threads??
        _eng._texture->load(textures);
        _eng._texture->purge();

        if(tm) {
            tm->render(_eng._renderer.get());
        }

        // start the next room
        _eng._rooms.back()->start();
        _eng.proc(Event{ Event::RoomStart, { prevId, _eng._rooms.back()->id } });
    }

    template<typename T>
    void GameUtility::room_overlay() {
        std::unique_ptr<Room> rm = std::make_unique<T>();
        _eng._rooms.emplace_back(rm);
        _eng._objects.emplace_back();
        auto s = _eng.size();
        _eng._views.emplace_back(0, 0, s.w, s.h);
        rm->start();
        _eng.proc(Event{ Event::RoomStart, { -1, rm->id } });
    }

    template<typename T, typename ... Args>
    void GameUtility::spawn(Args ... args) {
        _eng.spawn<T>(args ...);
    }

    template<typename T>
    bool GameUtility::collides(const Rectangle &where) const {
        if(_eng._rooms.back()->collides<T>(where)) {
            return true;
        } else {
            for(auto &o : _eng._objects.back()) {
                if(auto b = dynamic_cast<const T *>(o.get())) {
                    if(b->collides(where)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
#endif
