#ifndef __GAME_PLAYING_SOUND_H__
#define __GAME_PLAYING_SOUND_H__

namespace Game {
    class Sound;
    class PlayingSound {
        const Sound & _sound;
        int _channel;
    public:
        PlayingSound(const Sound & sound);
        void stop();
        float volume() const;
        void volume(float amt);
    };
}

#endif
