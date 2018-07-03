//! A component of the [`DrawableBuilder`] that adds some text with some effects applied

use model::shape::Point;

use super::super::super::font::Font;
use super::{DrawItem, DrawEffect, DrawableBuilder, BaseDrawableBuilder};
use super::Attributer;

/// Changes properties some text that is part of a [`Drawable`]
pub struct TextBuilder {
    font: Font,
    text: String,
    caret_pos: Option<usize>,
    offset: Point,
    builder: BaseDrawableBuilder,
    effects: Option<Vec<DrawEffect>>,
}

impl TextBuilder {
    /// Creates a new SpriteBuilder
    pub(crate) fn new(font: Font, text: String, builder: impl DrawableBuilder) -> Self {
        Self {
            font,
            text,
            caret_pos: None,
            offset: Point::default(),
            builder: builder.commit(),
            effects: None,
        }
    }

    /// Sets the offset to draw this text at
    pub fn offset(self, offset: Point) -> Self {
        Self {
            offset,
            ..self
        }
    }

    /// Draws a caret at the given position in the string
    pub fn caret_at(self, pos: usize,) -> Self {
        Self {
            caret_pos: Some(pos),
            ..self
        }
    }
}

impl DrawableBuilder for TextBuilder {
    fn commit(mut self) -> BaseDrawableBuilder {
        if !self.text.is_empty() {
            self.builder.0.push((DrawItem::Text(self.font, self.text, self.offset, self.caret_pos), self.effects));
        }
        self.builder
    }
}

impl Attributer for TextBuilder {
    fn effects(&mut self) -> &mut Vec<DrawEffect> {
        if self.effects.is_none() {
            self.effects = Some(vec![]);
        }
        let eff = self.effects.as_mut();
        eff.unwrap()
    }
}
