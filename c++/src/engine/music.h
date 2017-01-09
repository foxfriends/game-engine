#ifndef __GAME_MUSIC_H__
#define __GAME_MUSIC_H__

#include "sound.h"

namespace Game {
    class Music {
        typedef void (Deleter) (Mix_Music *);
        std::unique_ptr<Mix_Music, Deleter *> _music{ nullptr, Mix_FreeMusic };
    public:
        Music(const std::string & path);
        void play();
        void stop();
        float volume() const;
        void volume(float amt);
    };
}

#endif
