module Game
  Position = Struct.new(:x, :y) do
    def + pos
      Position.new x + pos.x, y + pos.y
    end

    def - pos
      Position.new x - pos.x, y - pos.y
    end

    def | shape
      case shape
      when Rectangle
        x >= shape.x && x < shape.x + shape.w && x >= shape.y && y < shape.y + shape.h
      when Circle
        (x - shape.x) ** 2 + (y - shape.y) ** 2 <= shape.r
      end
    end
    alias inside? |
  end

  Dimension = Struct.new(:w, :h) do
    def self.infinite
      Dimension.new Float::INFINITY, Float::INFINITY
    end

    def + dim
      Position.new x + dim.w, y + dim.h
    end

    def - dim
      Position.new x - dim.w, y - dim.h
    end
  end

  Rectangle = Struct.new(:x, :y, :w, :h) do
    def + pos
      case pos
      when Position
        Rectangle.new x + pos.x, y + pos.y, w, h
      when Dimension
        Rectangle.new x, y, w + pos.w, h + pos.h
      end
    end

    alias shift +
    alias extend +

    def | shape
      case shape
      when Rectangle
        ((x + w / 2) - (shape.x + shape.w / 2)).abs < (w + shape.w) / 2 && ((y + h / 2) - (shape.y + shape.h / 2)).abs < (h + shape.h) / 2
      when Circle
        shape | self
      end
    end
    alias intersects? |
  end

  Circle = Struct.new(:x, :y, :r) do
    def + pos
      Circle.new(x + pos.x, y + pos.y, r)
    end
    alias shift +

    def | shape
      case shape
      when Rectangle
        dx = (r.x - (o.x + o.w / 2)).abs
        dy = (r.y - (o.y + o.h / 2)).abs
        return false if dx > shape.w / 2 + r
        return false if dy > shape.h / 2 + r
        return true if dx <= shape.w / 2
        return true if dy <= shape.h / 2
        (dx - shape.w / 2) ** 2 + (dy - shape.h / 2) ** 2 <= r ** 2
      when Circle
        (x - shape.x) ** 2 + (y - shape.y) ** 2 <= (r + shape.r) ** 2
      end
    end
    alias intersects? |
  end
end
