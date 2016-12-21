#ifndef __GAME_INPUT_H__
#define __GAME_INPUT_H__

#include "struct.h"
#include "event.h"
#include <SDL.h>

namespace Game {
    class Input {
        bool _keystate[255] { false };
        bool _mousestate[3] { false };
        Position _mouseposition { 0, 0 };
    public:
        inline bool keystate(int key) { return _keystate[key]; }
        inline bool mousestate(int button) { return _mousestate[button]; }
        inline const Position & mouseposition() const { return _mouseposition; }

        class iterator : public std::iterator<std::input_iterator_tag, Input> {
            Input & _input;
            Event _event;
        public:
            iterator(Input & input);
            iterator(Input & input, const SDL_Event && event);
            iterator(const iterator & it);
            iterator & operator = (const iterator & o);
            bool operator == (const iterator & o) const;
            bool operator != (const iterator & o) const;
            iterator & operator ++ ();
            Event operator * () const;
        };

        iterator begin();
        iterator end();
    };
}
#endif
