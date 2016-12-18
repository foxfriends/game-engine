#include "demo/engine.h"
#include <string>
#include <iostream>

int main(int argc, char *argv[]) {
    Demo::Engine g{};
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
