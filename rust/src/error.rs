//! Errors that occur in the game engine
use std;
use std::fmt::{self, Formatter, Display};

/// Errors that occur in the game engine
#[derive(Debug)]
pub enum Error {
    /// An error that occurs while initializing SDL2_ttf
    TTFInit(::sdl2::ttf::InitError),
    /// An error that occurs while loading fonts
    Font(::sdl2::ttf::FontError),
    /// An error that occurs while building a texture
    TextureValue(::sdl2::render::TextureValueError),
    /// An error that occurs while building the SDL window
    WindowBuild(::sdl2::video::WindowBuildError),
    /// An stdio error
    IO(::std::io::Error),
    /// An error from a string
    String(String),
    #[allow(missing_docs, dead_code)] Unknown,
}

impl Display for Error {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl std::error::Error for Error {
    // TODO: this needs a real implementation...
    fn description(&self) -> &str { "An error has occurred!" }
}

impl From<::sdl2::ttf::InitError> for Error {
    fn from(error: ::sdl2::ttf::InitError) -> Error {
        Error::TTFInit(error)
    }
}

impl From<::sdl2::video::WindowBuildError> for Error {
    fn from(error: ::sdl2::video::WindowBuildError) -> Error {
        Error::WindowBuild(error)
    }
}

impl From<::sdl2::ttf::FontError> for Error {
    fn from(error: ::sdl2::ttf::FontError) -> Error {
        Error::Font(error)
    }
}

impl From<::sdl2::render::TextureValueError> for Error {
    fn from(error: ::sdl2::render::TextureValueError) -> Error {
        Error::TextureValue(error)
    }
}

impl From<::std::io::Error> for Error {
    fn from(error: ::std::io::Error) -> Error {
        Error::IO(error)
    }
}

impl From<String> for Error {
    fn from(string: String) -> Error {
        Error::String(string)
    }
}
