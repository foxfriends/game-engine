CXX = g++-5
CXXFLAGS = -std=c++14 -MMD -Wall $(shell sdl2-config --cflags --libs)
SOURCES = $(shell find src -name *.cc)
OBJECTS = ${SOURCES:.cc=.o}
DEPENDS = ${OBJECTS:.o=.d}
EXEC = engine-test
TESTSUITE = test/suite.txt
${EXEC}: ${OBJECTS}
	@echo Linking executable
	@${CXX} ${CXXFLAGS} ${OBJECTS} -o ${EXEC}
	@echo Done!
.PHONY: clean clean-dep list test
clean:
	-@rm ${OBJECTS} ${DEPENDS} ${EXEC} 2> /dev/null || true
clean-dep:
	-@rm ${OBJECTS} ${DEPENDS} 2> /dev/null || true
list:
	@echo ${OBJECTS}
