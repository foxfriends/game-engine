use sdl2;
use std::collections::HashMap;
use std::ffi::OsStr;

/// A `Texture` is used internally by the engine, which only exposes the
/// [`TextureID`](type.TextureID.html) to the game.
pub(super) type Texture<'a> = sdl2::render::Texture<'a>;

/// A `TextureID` identifies a Texture so it can be used by the [`Model`](trait.Model.html).
///
/// The value of the `TextureID` is a path from the running location of the game executable to the
/// image file (`.png`) that this `TextureID` is representing. This is to facilitate on-demand use
/// of textures, whether they have yet been loaded or not. If they are not loaded at the time they
/// are expected to be drawn they are loaded immediately.
///
/// TODO: find a way of pre-loading textures at a convenient time when they are known to be needed
/// soon.
// TODO: consider a newtype here to make the implementation less visible
pub type TextureID = &'static OsStr;

/// A Canvas provides an interface for the [`Model`](trait.Model.html) to render graphics.
pub struct Canvas<'a> {
    pub(super) canvas: &'a mut sdl2::render::Canvas<sdl2::video::Window>,
    pub(super) texture_creator: &'a sdl2::render::TextureCreator<sdl2::video::WindowContext>,
    pub(super) textures: HashMap<TextureID, Texture<'a>>
}

mod drawing {
    pub use sdl2::pixels::Color;

    impl<'a> super::Canvas<'a> {
        /// Sets the current drawing color.
        ///
        /// This color is used for any drawing operation, such as [`draw_clear`](#method.draw_clear)
        /// and (future functions) `draw_rectangle`, etc.
        #[inline]
        pub fn draw_set_color(&mut self, color: Color) {
            self.canvas.set_draw_color(color)
        }

        /// Fills the entire `Canvas` with the current drawing color, as set by
        /// [`draw_set_color`](#method.draw_set_color)
        #[inline]
        pub fn draw_clear(&mut self) {
            self.canvas.clear()
        }
    }
}

mod images {
    use sdl2;
    use super::super::shape::Rect;
    impl<'a> super::Canvas<'a> {
        /// Draws the entire [`Texture`](type.Texture.html) related to the provided
        /// [`TextureID`](type.TextureID.html) to the screen.
        ///
        /// In the case that a [`TextureID`](type.TextureID.html) has not yet be linked to a
        /// concreate texture, the texture will be loaded.
        #[inline]
        pub fn draw_image(&mut self, image: super::TextureID, x: i32, y: i32) {
            self.ensure_texture(image);
            let tex = self.textures.get(image).unwrap();
            let sdl2::render::TextureQuery{ width, height, .. } =  tex.query();
            self.canvas.copy(tex, None, sdl2::rect::Rect::new(x, y, width, height)).unwrap();
        }

        /// Draws part of the [`Texture`](type.Texture.html) related to the provided
        /// [`TextureID`](type.TextureID.html) to the screen.
        ///
        /// This is particularly useful for animated sprite sequences.
        ///
        /// In the case that a [`TextureID`](type.TextureID.html) has not yet be linked to a
        /// concreate texture, the texture will be loaded.
        #[inline]
        pub fn draw_image_part(&mut self, image: super::TextureID, part: Rect, x: i32, y: i32) {
            self.ensure_texture(image);
            let tex = self.textures.get(image).unwrap();
            self.canvas.copy(tex, part, Rect::new(x, y, part.width(), part.height())).unwrap();
        }
    }
}

mod rendering {
    impl<'a> super::Canvas<'a> {
        /// Actually presents the contents of the `Canvas` to the screen.
        #[inline]
        pub(in super::super) fn present(&mut self) {
            self.canvas.present()
        }
    }
}

mod texture_management {
    use sdl2::image::LoadTexture;

    impl<'a> super::Canvas<'a> {
        /// Removes *all* [`Texture`](type.Texture.html)s which have been loaded by this `Canvas`.
        ///
        /// Should be called when a lot of textures are no longer going to be used, such as when
        /// switching areas in the game.
        #[inline]
        pub fn clear_textures(&mut self) {
            self.textures.clear()
        }

        /// Ensures that a [`TextureID`](type.TextureID.html) has an actual Texture that it is
        /// pointing to. If it does not, the texture will be loaded immediately (on the rendering
        /// thread).
        ///
        /// It is recommended to process all texture loads pre-emptively to avoid visible lag as
        /// the textures load.
        pub fn ensure_texture(&mut self, key: super::TextureID) {
            if !self.textures.contains_key(key) {
                let tex = self.texture_creator.load_texture(key).expect(&format!("Image {} does not exist", key.to_string_lossy()));
                self.textures.insert(key, tex);
            }
        }

        // TODO: provide more fine-grained support for removing textures that will be unused.
    }
}
