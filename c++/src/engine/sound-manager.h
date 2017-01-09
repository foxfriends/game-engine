#ifndef __GAME_SOUND_MANAGER_H__
#define __GAME_SOUND_MANAGER_H__

#include <memory>
#include <string>
#include <vector>
#include <map>
#include "sound.h"
#include "music.h"

namespace Game {
    class SoundManager {
        std::map<std::string, std::string> _s_sources;
        std::map<std::string, std::string> _m_sources;
        std::map<std::string, std::unique_ptr<Sound>> _sounds;
        std::map<std::string, std::unique_ptr<Music>> _music;
        std::string _current_music;
        std::map<std::string, int> _s_references;
        std::map<std::string, int> _m_references;
    public:
        SoundManager(const std::map<std::string, std::string> & sound_sources, const std::map<std::string, std::string> & music_sources);
        Sound & sound(const std::string & name);
        void music(const std::string & name);
        void stop_music();

        void load_music(const std::vector<std::string> & names);
        void load_sound(const std::vector<std::string> & names);
        void purge_music(const std::vector<std::string> & names);
        void purge_sound(const std::vector<std::string> & names);
    };
};

#endif
