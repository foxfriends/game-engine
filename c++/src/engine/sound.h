#ifndef __GAME_SOUND_H__
#define __GAME_SOUND_H__

#include <memory>
#include <SDL_mixer.h>

namespace Game {
    class PlayingSound;
    class Sound {
        friend class PlayingSound;
        typedef void (Deleter) (Mix_Chunk *);
        std::unique_ptr<Mix_Chunk, Deleter *> _chunk{ nullptr, & Mix_FreeChunk };
    public:
        Sound(const std::string & path);
        PlayingSound play();
    };
}

#endif
