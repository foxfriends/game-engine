require_relative '../engine/engine'

class Demo < Game::Engine

end

Demo.new(Game::Dimension.new(1024, 768), 'Demo').run
