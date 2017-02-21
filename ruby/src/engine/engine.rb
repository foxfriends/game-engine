require 'gosu'

require_relative 'struct'

module Game
  class Engine < Gosu::Window
    def initialize size, caption
      super size.w, size.h
      self.caption = caption
    end

    def run
      self.show
    end

    def update
    end

    def draw
    end
  end
end
