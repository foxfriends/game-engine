#include "engine/engine.h"
#include <string>
#include <iostream>

class Engine : public Game::Engine {
public:
    Engine() : Game::Engine{"Game", { 1024, 768 }} {}
};

int main(int argc, char *argv[]) {
    Engine g{};
    try {
        return g.run();
    } catch(std::string err) {
        std::cerr << err << std::endl;
        return 1;
    } catch(char const * err) {
        std::cerr << err << std::endl;
        return 1;
    }
}
