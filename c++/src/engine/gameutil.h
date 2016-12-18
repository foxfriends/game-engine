#ifndef __GAME_UTIL_H__
#define __GAME_UTIL_H__

#include "engine.h"
#include "room.h"
#include "event.h"
#include "object.h"

namespace Game {
    class Collider;
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
        inline void end() { _eng._ended = true; }
        inline void restart() { end(); _eng._restart = true; }

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
    };

    template<typename T>
    void GameUtility::room_goto() {
        std::unique_ptr<Room> rm = std::make_unique<T>();
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

        // TODO: figure out loading in C++
        //       is this something to do with threads?

        // star the next room
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
};
#endif
