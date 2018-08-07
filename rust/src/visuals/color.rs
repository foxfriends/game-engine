//! RGBA colors

use std::ops::{Add, Sub, Mul, Div};

use sdl2::pixels as sdl;

/// An RGBA color. Implements some basic operators as their respective blend modes. Other blend
/// modes are just methods.
#[derive(Copy, Clone, Eq, Debug)]
pub struct Color {
    /// The red component
    pub red: u8,
    /// The green component
    pub green: u8,
    /// The blue component
    pub blue: u8,
    /// The alpha
    pub alpha: u8,
}

impl Default for Color {
    fn default() -> Color {
        Color::WHITE
    }
}

impl PartialEq for Color {
    fn eq(&self, other: &Self) -> bool {
        if self.alpha == 0 && other.alpha == 0 {
            true
        } else {
            self.red == other.red &&
            self.green == other.green &&
            self.blue == other.blue &&
            self.alpha == other.alpha
        }
    }
}

impl Color {
    /// Tranpsarent color
    pub const TRANSPARENT: Self = Color::rgba(0, 0, 0, 0);
    /// Pure opaque red
    pub const RED: Self = Color::rgb(255, 0, 0);
    /// Pure opaque green
    pub const GREEN: Self = Color::rgb(0, 255, 0);
    /// Pure opaque blue
    pub const BLUE: Self = Color::rgb(0, 0, 255);
    /// Pure opaque white
    pub const WHITE: Self = Color::rgb(255, 255, 255);
    /// Pure opaque black
    pub const BLACK: Self = Color::rgb(0, 0, 0);

    /// Creates a new opaque color
    pub const fn rgb(red: u8, green: u8, blue: u8) -> Self {
        Self::rgba(red, green, blue, 255)
    }

    /// Creates a new color with some alpha value
    pub const fn rgba(red: u8, green: u8, blue: u8, alpha: u8) -> Self {
        Self {
            red,
            green,
            blue,
            alpha,
        }
    }

    /// Sets the alpha component
    pub fn with_alpha(self, alpha: u8) -> Self {
        Self {
            alpha,
            ..self
        }
    }

    /// The red component as a percentage between 0 and 1
    pub fn redf(&self) -> f32 {
        self.red as f32 / 255.
    }

    /// The green component as a percentage between 0 and 1
    pub fn greenf(&self) -> f32 {
        self.green as f32 / 255.
    }

    /// The blue component as a percentage between 0 and 1
    pub fn bluef(&self) -> f32 {
        self.blue as f32 / 255.
    }

    /// The alpha component as a percentage between 0 and 1
    pub fn alphaf(&self) -> f32 {
        self.alpha as f32 / 255.
    }
}

impl Add for Color {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        Self {
            red: self.red.saturating_add((other.red as f32 * other.alphaf()) as u8),
            green: self.green.saturating_add((other.green as f32 * other.alphaf()) as u8),
            blue: self.blue.saturating_add((other.blue as f32 * other.alphaf()) as u8),
            alpha: self.alpha + other.alpha,
        }
    }
}

impl Sub for Color {
    type Output = Self;

    fn sub(self, other: Self) -> Self {
        Self {
            red: self.red.saturating_sub(other.red),
            green: self.green.saturating_sub(other.green),
            blue: self.blue.saturating_sub(other.blue),
            alpha: self.alpha.saturating_sub(other.alpha),
        }
    }
}

impl Mul for Color {
    type Output = Self;

    fn mul(self, other: Self) -> Self {
        Self {
            red: (self.redf() * other.redf() * 255.) as u8,
            green: (self.greenf() * other.greenf() * 255.) as u8,
            blue: (self.bluef() * other.bluef() * 255.) as u8,
            alpha: (self.alphaf() * other.alphaf() * 255.) as u8,
        }
    }
}

impl Div for Color {
    type Output = Self;

    fn div(self, other: Self) -> Self {
        if other.alpha == 0 {
            Self {
                red: (self.redf() / other.redf() * 255.) as u8,
                green: (self.greenf() / other.greenf() * 255.) as u8,
                blue: (self.bluef() / other.bluef() * 255.) as u8,
                alpha: 255,
            }
        } else {
            Self {
                red: (self.redf() / other.redf() * 255.) as u8,
                green: (self.greenf() / other.greenf() * 255.) as u8,
                blue: (self.bluef() / other.bluef() * 255.) as u8,
                alpha: (self.alphaf() / other.alphaf() * 255.) as u8,
            }
        }
    }
}

impl Into<sdl::Color> for Color {
    fn into(self) -> sdl::Color {
        if self.alpha == 255 {
            sdl::Color::RGB(self.red, self.green, self.blue)
        } else {
            sdl::Color::RGBA(self.red, self.green, self.blue, self.alpha)
        }
    }
}

impl From<u32> for Color {
    fn from(hex: u32) -> Self {
        Color::rgba(
            ((hex & 0xff000000) >> 24) as u8,
            ((hex & 0x00ff0000) >> 16) as u8,
            ((hex & 0x0000ff00) >> 8) as u8,
            (hex & 0x000000ff) as u8,
        )
    }
}

impl Into<u32> for Color {
    fn into(self) -> u32 {
        ((self.red as u32) << 24) & ((self.green as u32) << 16) & ((self.blue as u32) << 8) & self.alpha as u32
    }
}
