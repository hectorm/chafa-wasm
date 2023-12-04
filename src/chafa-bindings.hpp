#ifndef __CHAFA_BINDINGS__
#define __CHAFA_BINDINGS__

#include <chafa.h>

#include <emscripten/bind.h>
#include <emscripten/val.h>

EMSCRIPTEN_BINDINGS(Chafa) {
  emscripten::enum_<ChafaCanvasMode>("ChafaCanvasMode")
      .value("CHAFA_CANVAS_MODE_TRUECOLOR", CHAFA_CANVAS_MODE_TRUECOLOR)
      .value("CHAFA_CANVAS_MODE_INDEXED_256", CHAFA_CANVAS_MODE_INDEXED_256)
      .value("CHAFA_CANVAS_MODE_INDEXED_240", CHAFA_CANVAS_MODE_INDEXED_240)
      .value("CHAFA_CANVAS_MODE_INDEXED_16", CHAFA_CANVAS_MODE_INDEXED_16)
      .value("CHAFA_CANVAS_MODE_INDEXED_16_8", CHAFA_CANVAS_MODE_INDEXED_16_8)
      .value("CHAFA_CANVAS_MODE_INDEXED_8", CHAFA_CANVAS_MODE_INDEXED_8)
      .value("CHAFA_CANVAS_MODE_FGBG_BGFG", CHAFA_CANVAS_MODE_FGBG_BGFG)
      .value("CHAFA_CANVAS_MODE_FGBG", CHAFA_CANVAS_MODE_FGBG)
      .value("CHAFA_CANVAS_MODE_MAX", CHAFA_CANVAS_MODE_MAX);
  emscripten::enum_<ChafaColorExtractor>("ChafaColorExtractor")
      .value("CHAFA_COLOR_EXTRACTOR_AVERAGE", CHAFA_COLOR_EXTRACTOR_AVERAGE)
      .value("CHAFA_COLOR_EXTRACTOR_MEDIAN", CHAFA_COLOR_EXTRACTOR_MEDIAN)
      .value("CHAFA_COLOR_EXTRACTOR_MAX", CHAFA_COLOR_EXTRACTOR_MAX);
  emscripten::enum_<ChafaColorSpace>("ChafaColorSpace")
      .value("CHAFA_COLOR_SPACE_RGB", CHAFA_COLOR_SPACE_RGB)
      .value("CHAFA_COLOR_SPACE_DIN99D", CHAFA_COLOR_SPACE_DIN99D)
      .value("CHAFA_COLOR_SPACE_MAX", CHAFA_COLOR_SPACE_MAX);
  emscripten::enum_<ChafaDitherMode>("ChafaDitherMode")
      .value("CHAFA_DITHER_MODE_NONE", CHAFA_DITHER_MODE_NONE)
      .value("CHAFA_DITHER_MODE_ORDERED", CHAFA_DITHER_MODE_ORDERED)
      .value("CHAFA_DITHER_MODE_DIFFUSION", CHAFA_DITHER_MODE_DIFFUSION)
      .value("CHAFA_DITHER_MODE_MAX", CHAFA_DITHER_MODE_MAX);
  emscripten::enum_<ChafaPixelMode>("ChafaPixelMode")
      .value("CHAFA_PIXEL_MODE_SYMBOLS", CHAFA_PIXEL_MODE_SYMBOLS)
      .value("CHAFA_PIXEL_MODE_SIXELS", CHAFA_PIXEL_MODE_SIXELS)
      .value("CHAFA_PIXEL_MODE_KITTY", CHAFA_PIXEL_MODE_KITTY)
      .value("CHAFA_PIXEL_MODE_ITERM2", CHAFA_PIXEL_MODE_ITERM2)
      .value("CHAFA_PIXEL_MODE_MAX", CHAFA_PIXEL_MODE_MAX);
  emscripten::enum_<ChafaOptimizations>("ChafaOptimizations")
      .value("CHAFA_OPTIMIZATION_REUSE_ATTRIBUTES", CHAFA_OPTIMIZATION_REUSE_ATTRIBUTES)
      .value("CHAFA_OPTIMIZATION_SKIP_CELLS", CHAFA_OPTIMIZATION_SKIP_CELLS)
      .value("CHAFA_OPTIMIZATION_REPEAT_CELLS", CHAFA_OPTIMIZATION_REPEAT_CELLS)
      .value("CHAFA_OPTIMIZATION_NONE", CHAFA_OPTIMIZATION_NONE)
      .value("CHAFA_OPTIMIZATION_ALL", CHAFA_OPTIMIZATION_ALL);
  emscripten::enum_<ChafaPassthrough>("ChafaPassthrough")
      .value("CHAFA_PASSTHROUGH_NONE", CHAFA_PASSTHROUGH_NONE)
      .value("CHAFA_PASSTHROUGH_SCREEN", CHAFA_PASSTHROUGH_SCREEN)
      .value("CHAFA_PASSTHROUGH_TMUX", CHAFA_PASSTHROUGH_TMUX)
      .value("CHAFA_PASSTHROUGH_MAX", CHAFA_PASSTHROUGH_MAX);
  emscripten::enum_<ChafaPixelType>("ChafaPixelType")
      .value("CHAFA_PIXEL_RGBA8_PREMULTIPLIED", CHAFA_PIXEL_RGBA8_PREMULTIPLIED)
      .value("CHAFA_PIXEL_BGRA8_PREMULTIPLIED", CHAFA_PIXEL_BGRA8_PREMULTIPLIED)
      .value("CHAFA_PIXEL_ARGB8_PREMULTIPLIED", CHAFA_PIXEL_ARGB8_PREMULTIPLIED)
      .value("CHAFA_PIXEL_ABGR8_PREMULTIPLIED", CHAFA_PIXEL_ABGR8_PREMULTIPLIED)
      .value("CHAFA_PIXEL_RGBA8_UNASSOCIATED", CHAFA_PIXEL_RGBA8_UNASSOCIATED)
      .value("CHAFA_PIXEL_BGRA8_UNASSOCIATED", CHAFA_PIXEL_BGRA8_UNASSOCIATED)
      .value("CHAFA_PIXEL_ARGB8_UNASSOCIATED", CHAFA_PIXEL_ARGB8_UNASSOCIATED)
      .value("CHAFA_PIXEL_ABGR8_UNASSOCIATED", CHAFA_PIXEL_ABGR8_UNASSOCIATED)
      .value("CHAFA_PIXEL_RGB8", CHAFA_PIXEL_RGB8)
      .value("CHAFA_PIXEL_BGR8", CHAFA_PIXEL_BGR8)
      .value("CHAFA_PIXEL_MAX", CHAFA_PIXEL_MAX);
  emscripten::enum_<ChafaFeatures>("ChafaFeatures")
      .value("CHAFA_FEATURE_MMX", CHAFA_FEATURE_MMX)
      .value("CHAFA_FEATURE_SSE41", CHAFA_FEATURE_SSE41)
      .value("CHAFA_FEATURE_POPCNT", CHAFA_FEATURE_POPCNT)
      .value("CHAFA_FEATURE_AVX2", CHAFA_FEATURE_AVX2);
  emscripten::enum_<ChafaSymbolTags>("ChafaSymbolTags")
      .value("CHAFA_SYMBOL_TAG_NONE", CHAFA_SYMBOL_TAG_NONE)
      .value("CHAFA_SYMBOL_TAG_SPACE", CHAFA_SYMBOL_TAG_SPACE)
      .value("CHAFA_SYMBOL_TAG_SOLID", CHAFA_SYMBOL_TAG_SOLID)
      .value("CHAFA_SYMBOL_TAG_STIPPLE", CHAFA_SYMBOL_TAG_STIPPLE)
      .value("CHAFA_SYMBOL_TAG_BLOCK", CHAFA_SYMBOL_TAG_BLOCK)
      .value("CHAFA_SYMBOL_TAG_BORDER", CHAFA_SYMBOL_TAG_BORDER)
      .value("CHAFA_SYMBOL_TAG_DIAGONAL", CHAFA_SYMBOL_TAG_DIAGONAL)
      .value("CHAFA_SYMBOL_TAG_DOT", CHAFA_SYMBOL_TAG_DOT)
      .value("CHAFA_SYMBOL_TAG_QUAD", CHAFA_SYMBOL_TAG_QUAD)
      .value("CHAFA_SYMBOL_TAG_HHALF", CHAFA_SYMBOL_TAG_HHALF)
      .value("CHAFA_SYMBOL_TAG_VHALF", CHAFA_SYMBOL_TAG_VHALF)
      .value("CHAFA_SYMBOL_TAG_HALF", CHAFA_SYMBOL_TAG_HALF)
      .value("CHAFA_SYMBOL_TAG_INVERTED", CHAFA_SYMBOL_TAG_INVERTED)
      .value("CHAFA_SYMBOL_TAG_BRAILLE", CHAFA_SYMBOL_TAG_BRAILLE)
      .value("CHAFA_SYMBOL_TAG_TECHNICAL", CHAFA_SYMBOL_TAG_TECHNICAL)
      .value("CHAFA_SYMBOL_TAG_GEOMETRIC", CHAFA_SYMBOL_TAG_GEOMETRIC)
      .value("CHAFA_SYMBOL_TAG_ASCII", CHAFA_SYMBOL_TAG_ASCII)
      .value("CHAFA_SYMBOL_TAG_ALPHA", CHAFA_SYMBOL_TAG_ALPHA)
      .value("CHAFA_SYMBOL_TAG_DIGIT", CHAFA_SYMBOL_TAG_DIGIT)
      .value("CHAFA_SYMBOL_TAG_ALNUM", CHAFA_SYMBOL_TAG_ALNUM)
      .value("CHAFA_SYMBOL_TAG_NARROW", CHAFA_SYMBOL_TAG_NARROW)
      .value("CHAFA_SYMBOL_TAG_WIDE", CHAFA_SYMBOL_TAG_WIDE)
      .value("CHAFA_SYMBOL_TAG_AMBIGUOUS", CHAFA_SYMBOL_TAG_AMBIGUOUS)
      .value("CHAFA_SYMBOL_TAG_UGLY", CHAFA_SYMBOL_TAG_UGLY)
      .value("CHAFA_SYMBOL_TAG_LEGACY", CHAFA_SYMBOL_TAG_LEGACY)
      .value("CHAFA_SYMBOL_TAG_SEXTANT", CHAFA_SYMBOL_TAG_SEXTANT)
      .value("CHAFA_SYMBOL_TAG_WEDGE", CHAFA_SYMBOL_TAG_WEDGE)
      .value("CHAFA_SYMBOL_TAG_LATIN", CHAFA_SYMBOL_TAG_LATIN)
      .value("CHAFA_SYMBOL_TAG_IMPORTED", CHAFA_SYMBOL_TAG_IMPORTED)
      .value("CHAFA_SYMBOL_TAG_EXTRA", CHAFA_SYMBOL_TAG_EXTRA)
      .value("CHAFA_SYMBOL_TAG_BAD", CHAFA_SYMBOL_TAG_BAD)
      .value("CHAFA_SYMBOL_TAG_ALL", CHAFA_SYMBOL_TAG_ALL);
  emscripten::enum_<ChafaTermSeq>("ChafaTermSeq")
      .value("CHAFA_TERM_SEQ_RESET_TERMINAL_SOFT", CHAFA_TERM_SEQ_RESET_TERMINAL_SOFT)
      .value("CHAFA_TERM_SEQ_RESET_TERMINAL_HARD", CHAFA_TERM_SEQ_RESET_TERMINAL_HARD)
      .value("CHAFA_TERM_SEQ_RESET_ATTRIBUTES", CHAFA_TERM_SEQ_RESET_ATTRIBUTES)
      .value("CHAFA_TERM_SEQ_CLEAR", CHAFA_TERM_SEQ_CLEAR)
      .value("CHAFA_TERM_SEQ_INVERT_COLORS", CHAFA_TERM_SEQ_INVERT_COLORS)
      .value("CHAFA_TERM_SEQ_CURSOR_TO_TOP_LEFT", CHAFA_TERM_SEQ_CURSOR_TO_TOP_LEFT)
      .value("CHAFA_TERM_SEQ_CURSOR_TO_BOTTOM_LEFT", CHAFA_TERM_SEQ_CURSOR_TO_BOTTOM_LEFT)
      .value("CHAFA_TERM_SEQ_CURSOR_TO_POS", CHAFA_TERM_SEQ_CURSOR_TO_POS)
      .value("CHAFA_TERM_SEQ_CURSOR_UP_1", CHAFA_TERM_SEQ_CURSOR_UP_1)
      .value("CHAFA_TERM_SEQ_CURSOR_UP", CHAFA_TERM_SEQ_CURSOR_UP)
      .value("CHAFA_TERM_SEQ_CURSOR_DOWN_1", CHAFA_TERM_SEQ_CURSOR_DOWN_1)
      .value("CHAFA_TERM_SEQ_CURSOR_DOWN", CHAFA_TERM_SEQ_CURSOR_DOWN)
      .value("CHAFA_TERM_SEQ_CURSOR_LEFT_1", CHAFA_TERM_SEQ_CURSOR_LEFT_1)
      .value("CHAFA_TERM_SEQ_CURSOR_LEFT", CHAFA_TERM_SEQ_CURSOR_LEFT)
      .value("CHAFA_TERM_SEQ_CURSOR_RIGHT_1", CHAFA_TERM_SEQ_CURSOR_RIGHT_1)
      .value("CHAFA_TERM_SEQ_CURSOR_RIGHT", CHAFA_TERM_SEQ_CURSOR_RIGHT)
      .value("CHAFA_TERM_SEQ_CURSOR_UP_SCROLL", CHAFA_TERM_SEQ_CURSOR_UP_SCROLL)
      .value("CHAFA_TERM_SEQ_CURSOR_DOWN_SCROLL", CHAFA_TERM_SEQ_CURSOR_DOWN_SCROLL)
      .value("CHAFA_TERM_SEQ_INSERT_CELLS", CHAFA_TERM_SEQ_INSERT_CELLS)
      .value("CHAFA_TERM_SEQ_DELETE_CELLS", CHAFA_TERM_SEQ_DELETE_CELLS)
      .value("CHAFA_TERM_SEQ_INSERT_ROWS", CHAFA_TERM_SEQ_INSERT_ROWS)
      .value("CHAFA_TERM_SEQ_DELETE_ROWS", CHAFA_TERM_SEQ_DELETE_ROWS)
      .value("CHAFA_TERM_SEQ_SET_SCROLLING_ROWS", CHAFA_TERM_SEQ_SET_SCROLLING_ROWS)
      .value("CHAFA_TERM_SEQ_ENABLE_INSERT", CHAFA_TERM_SEQ_ENABLE_INSERT)
      .value("CHAFA_TERM_SEQ_DISABLE_INSERT", CHAFA_TERM_SEQ_DISABLE_INSERT)
      .value("CHAFA_TERM_SEQ_ENABLE_CURSOR", CHAFA_TERM_SEQ_ENABLE_CURSOR)
      .value("CHAFA_TERM_SEQ_DISABLE_CURSOR", CHAFA_TERM_SEQ_DISABLE_CURSOR)
      .value("CHAFA_TERM_SEQ_ENABLE_ECHO", CHAFA_TERM_SEQ_ENABLE_ECHO)
      .value("CHAFA_TERM_SEQ_DISABLE_ECHO", CHAFA_TERM_SEQ_DISABLE_ECHO)
      .value("CHAFA_TERM_SEQ_ENABLE_WRAP", CHAFA_TERM_SEQ_ENABLE_WRAP)
      .value("CHAFA_TERM_SEQ_DISABLE_WRAP", CHAFA_TERM_SEQ_DISABLE_WRAP)
      .value("CHAFA_TERM_SEQ_SET_COLOR_FG_DIRECT", CHAFA_TERM_SEQ_SET_COLOR_FG_DIRECT)
      .value("CHAFA_TERM_SEQ_SET_COLOR_BG_DIRECT", CHAFA_TERM_SEQ_SET_COLOR_BG_DIRECT)
      .value("CHAFA_TERM_SEQ_SET_COLOR_FGBG_DIRECT", CHAFA_TERM_SEQ_SET_COLOR_FGBG_DIRECT)
      .value("CHAFA_TERM_SEQ_SET_COLOR_FG_256", CHAFA_TERM_SEQ_SET_COLOR_FG_256)
      .value("CHAFA_TERM_SEQ_SET_COLOR_BG_256", CHAFA_TERM_SEQ_SET_COLOR_BG_256)
      .value("CHAFA_TERM_SEQ_SET_COLOR_FGBG_256", CHAFA_TERM_SEQ_SET_COLOR_FGBG_256)
      .value("CHAFA_TERM_SEQ_SET_COLOR_FG_16", CHAFA_TERM_SEQ_SET_COLOR_FG_16)
      .value("CHAFA_TERM_SEQ_SET_COLOR_BG_16", CHAFA_TERM_SEQ_SET_COLOR_BG_16)
      .value("CHAFA_TERM_SEQ_SET_COLOR_FGBG_16", CHAFA_TERM_SEQ_SET_COLOR_FGBG_16)
      .value("CHAFA_TERM_SEQ_BEGIN_SIXELS", CHAFA_TERM_SEQ_BEGIN_SIXELS)
      .value("CHAFA_TERM_SEQ_END_SIXELS", CHAFA_TERM_SEQ_END_SIXELS)
      .value("CHAFA_TERM_SEQ_REPEAT_CHAR", CHAFA_TERM_SEQ_REPEAT_CHAR)
      .value("CHAFA_TERM_SEQ_BEGIN_KITTY_IMMEDIATE_IMAGE_V1", CHAFA_TERM_SEQ_BEGIN_KITTY_IMMEDIATE_IMAGE_V1)
      .value("CHAFA_TERM_SEQ_END_KITTY_IMAGE", CHAFA_TERM_SEQ_END_KITTY_IMAGE)
      .value("CHAFA_TERM_SEQ_BEGIN_KITTY_IMAGE_CHUNK", CHAFA_TERM_SEQ_BEGIN_KITTY_IMAGE_CHUNK)
      .value("CHAFA_TERM_SEQ_END_KITTY_IMAGE_CHUNK", CHAFA_TERM_SEQ_END_KITTY_IMAGE_CHUNK)
      .value("CHAFA_TERM_SEQ_BEGIN_ITERM2_IMAGE", CHAFA_TERM_SEQ_BEGIN_ITERM2_IMAGE)
      .value("CHAFA_TERM_SEQ_END_ITERM2_IMAGE", CHAFA_TERM_SEQ_END_ITERM2_IMAGE)
      .value("CHAFA_TERM_SEQ_ENABLE_SIXEL_SCROLLING", CHAFA_TERM_SEQ_ENABLE_SIXEL_SCROLLING)
      .value("CHAFA_TERM_SEQ_DISABLE_SIXEL_SCROLLING", CHAFA_TERM_SEQ_DISABLE_SIXEL_SCROLLING)
      .value("CHAFA_TERM_SEQ_ENABLE_BOLD", CHAFA_TERM_SEQ_ENABLE_BOLD)
      .value("CHAFA_TERM_SEQ_SET_COLOR_FG_8", CHAFA_TERM_SEQ_SET_COLOR_FG_8)
      .value("CHAFA_TERM_SEQ_SET_COLOR_BG_8", CHAFA_TERM_SEQ_SET_COLOR_BG_8)
      .value("CHAFA_TERM_SEQ_SET_COLOR_FGBG_8", CHAFA_TERM_SEQ_SET_COLOR_FGBG_8)
      .value("CHAFA_TERM_SEQ_RESET_DEFAULT_FG", CHAFA_TERM_SEQ_RESET_DEFAULT_FG)
      .value("CHAFA_TERM_SEQ_SET_DEFAULT_FG", CHAFA_TERM_SEQ_SET_DEFAULT_FG)
      .value("CHAFA_TERM_SEQ_QUERY_DEFAULT_FG", CHAFA_TERM_SEQ_QUERY_DEFAULT_FG)
      .value("CHAFA_TERM_SEQ_RESET_DEFAULT_BG", CHAFA_TERM_SEQ_RESET_DEFAULT_BG)
      .value("CHAFA_TERM_SEQ_SET_DEFAULT_BG", CHAFA_TERM_SEQ_SET_DEFAULT_BG)
      .value("CHAFA_TERM_SEQ_QUERY_DEFAULT_BG", CHAFA_TERM_SEQ_QUERY_DEFAULT_BG)
      .value("CHAFA_TERM_SEQ_RETURN_KEY", CHAFA_TERM_SEQ_RETURN_KEY)
      .value("CHAFA_TERM_SEQ_BACKSPACE_KEY", CHAFA_TERM_SEQ_BACKSPACE_KEY)
      .value("CHAFA_TERM_SEQ_TAB_KEY", CHAFA_TERM_SEQ_TAB_KEY)
      .value("CHAFA_TERM_SEQ_TAB_SHIFT_KEY", CHAFA_TERM_SEQ_TAB_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_UP_KEY", CHAFA_TERM_SEQ_UP_KEY)
      .value("CHAFA_TERM_SEQ_UP_CTRL_KEY", CHAFA_TERM_SEQ_UP_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_UP_SHIFT_KEY", CHAFA_TERM_SEQ_UP_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_DOWN_KEY", CHAFA_TERM_SEQ_DOWN_KEY)
      .value("CHAFA_TERM_SEQ_DOWN_CTRL_KEY", CHAFA_TERM_SEQ_DOWN_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_DOWN_SHIFT_KEY", CHAFA_TERM_SEQ_DOWN_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_LEFT_KEY", CHAFA_TERM_SEQ_LEFT_KEY)
      .value("CHAFA_TERM_SEQ_LEFT_CTRL_KEY", CHAFA_TERM_SEQ_LEFT_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_LEFT_SHIFT_KEY", CHAFA_TERM_SEQ_LEFT_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_RIGHT_KEY", CHAFA_TERM_SEQ_RIGHT_KEY)
      .value("CHAFA_TERM_SEQ_RIGHT_CTRL_KEY", CHAFA_TERM_SEQ_RIGHT_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_RIGHT_SHIFT_KEY", CHAFA_TERM_SEQ_RIGHT_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_PAGE_UP_KEY", CHAFA_TERM_SEQ_PAGE_UP_KEY)
      .value("CHAFA_TERM_SEQ_PAGE_UP_CTRL_KEY", CHAFA_TERM_SEQ_PAGE_UP_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_PAGE_UP_SHIFT_KEY", CHAFA_TERM_SEQ_PAGE_UP_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_PAGE_DOWN_KEY", CHAFA_TERM_SEQ_PAGE_DOWN_KEY)
      .value("CHAFA_TERM_SEQ_PAGE_DOWN_CTRL_KEY", CHAFA_TERM_SEQ_PAGE_DOWN_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_PAGE_DOWN_SHIFT_KEY", CHAFA_TERM_SEQ_PAGE_DOWN_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_HOME_KEY", CHAFA_TERM_SEQ_HOME_KEY)
      .value("CHAFA_TERM_SEQ_HOME_CTRL_KEY", CHAFA_TERM_SEQ_HOME_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_HOME_SHIFT_KEY", CHAFA_TERM_SEQ_HOME_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_END_KEY", CHAFA_TERM_SEQ_END_KEY)
      .value("CHAFA_TERM_SEQ_END_CTRL_KEY", CHAFA_TERM_SEQ_END_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_END_SHIFT_KEY", CHAFA_TERM_SEQ_END_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_INSERT_KEY", CHAFA_TERM_SEQ_INSERT_KEY)
      .value("CHAFA_TERM_SEQ_INSERT_CTRL_KEY", CHAFA_TERM_SEQ_INSERT_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_INSERT_SHIFT_KEY", CHAFA_TERM_SEQ_INSERT_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_DELETE_KEY", CHAFA_TERM_SEQ_DELETE_KEY)
      .value("CHAFA_TERM_SEQ_DELETE_CTRL_KEY", CHAFA_TERM_SEQ_DELETE_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_DELETE_SHIFT_KEY", CHAFA_TERM_SEQ_DELETE_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F1_KEY", CHAFA_TERM_SEQ_F1_KEY)
      .value("CHAFA_TERM_SEQ_F1_CTRL_KEY", CHAFA_TERM_SEQ_F1_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F1_SHIFT_KEY", CHAFA_TERM_SEQ_F1_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F2_KEY", CHAFA_TERM_SEQ_F2_KEY)
      .value("CHAFA_TERM_SEQ_F2_CTRL_KEY", CHAFA_TERM_SEQ_F2_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F2_SHIFT_KEY", CHAFA_TERM_SEQ_F2_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F3_KEY", CHAFA_TERM_SEQ_F3_KEY)
      .value("CHAFA_TERM_SEQ_F3_CTRL_KEY", CHAFA_TERM_SEQ_F3_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F3_SHIFT_KEY", CHAFA_TERM_SEQ_F3_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F4_KEY", CHAFA_TERM_SEQ_F4_KEY)
      .value("CHAFA_TERM_SEQ_F4_CTRL_KEY", CHAFA_TERM_SEQ_F4_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F4_SHIFT_KEY", CHAFA_TERM_SEQ_F4_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F5_KEY", CHAFA_TERM_SEQ_F5_KEY)
      .value("CHAFA_TERM_SEQ_F5_CTRL_KEY", CHAFA_TERM_SEQ_F5_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F5_SHIFT_KEY", CHAFA_TERM_SEQ_F5_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F6_KEY", CHAFA_TERM_SEQ_F6_KEY)
      .value("CHAFA_TERM_SEQ_F6_CTRL_KEY", CHAFA_TERM_SEQ_F6_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F6_SHIFT_KEY", CHAFA_TERM_SEQ_F6_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F7_KEY", CHAFA_TERM_SEQ_F7_KEY)
      .value("CHAFA_TERM_SEQ_F7_CTRL_KEY", CHAFA_TERM_SEQ_F7_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F7_SHIFT_KEY", CHAFA_TERM_SEQ_F7_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F8_KEY", CHAFA_TERM_SEQ_F8_KEY)
      .value("CHAFA_TERM_SEQ_F8_CTRL_KEY", CHAFA_TERM_SEQ_F8_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F8_SHIFT_KEY", CHAFA_TERM_SEQ_F8_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F9_KEY", CHAFA_TERM_SEQ_F9_KEY)
      .value("CHAFA_TERM_SEQ_F9_CTRL_KEY", CHAFA_TERM_SEQ_F9_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F9_SHIFT_KEY", CHAFA_TERM_SEQ_F9_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F10_KEY", CHAFA_TERM_SEQ_F10_KEY)
      .value("CHAFA_TERM_SEQ_F10_CTRL_KEY", CHAFA_TERM_SEQ_F10_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F10_SHIFT_KEY", CHAFA_TERM_SEQ_F10_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F11_KEY", CHAFA_TERM_SEQ_F11_KEY)
      .value("CHAFA_TERM_SEQ_F11_CTRL_KEY", CHAFA_TERM_SEQ_F11_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F11_SHIFT_KEY", CHAFA_TERM_SEQ_F11_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_F12_KEY", CHAFA_TERM_SEQ_F12_KEY)
      .value("CHAFA_TERM_SEQ_F12_CTRL_KEY", CHAFA_TERM_SEQ_F12_CTRL_KEY)
      .value("CHAFA_TERM_SEQ_F12_SHIFT_KEY", CHAFA_TERM_SEQ_F12_SHIFT_KEY)
      .value("CHAFA_TERM_SEQ_RESET_COLOR_FG", CHAFA_TERM_SEQ_RESET_COLOR_FG)
      .value("CHAFA_TERM_SEQ_RESET_COLOR_BG", CHAFA_TERM_SEQ_RESET_COLOR_BG)
      .value("CHAFA_TERM_SEQ_RESET_COLOR_FGBG", CHAFA_TERM_SEQ_RESET_COLOR_FGBG)
      .value("CHAFA_TERM_SEQ_RESET_SCROLLING_ROWS", CHAFA_TERM_SEQ_RESET_SCROLLING_ROWS)
      .value("CHAFA_TERM_SEQ_SAVE_CURSOR_POS", CHAFA_TERM_SEQ_SAVE_CURSOR_POS)
      .value("CHAFA_TERM_SEQ_RESTORE_CURSOR_POS", CHAFA_TERM_SEQ_RESTORE_CURSOR_POS)
      .value("CHAFA_TERM_SEQ_SET_SIXEL_ADVANCE_DOWN", CHAFA_TERM_SEQ_SET_SIXEL_ADVANCE_DOWN)
      .value("CHAFA_TERM_SEQ_SET_SIXEL_ADVANCE_RIGHT", CHAFA_TERM_SEQ_SET_SIXEL_ADVANCE_RIGHT)
      .value("CHAFA_TERM_SEQ_ENABLE_ALT_SCREEN", CHAFA_TERM_SEQ_ENABLE_ALT_SCREEN)
      .value("CHAFA_TERM_SEQ_DISABLE_ALT_SCREEN", CHAFA_TERM_SEQ_DISABLE_ALT_SCREEN)
      .value("CHAFA_TERM_SEQ_MAX", CHAFA_TERM_SEQ_MAX)
      .value("CHAFA_TERM_SEQ_BEGIN_SCREEN_PASSTHROUGH", CHAFA_TERM_SEQ_BEGIN_SCREEN_PASSTHROUGH)
      .value("CHAFA_TERM_SEQ_END_SCREEN_PASSTHROUGH", CHAFA_TERM_SEQ_END_SCREEN_PASSTHROUGH)
      .value("CHAFA_TERM_SEQ_BEGIN_TMUX_PASSTHROUGH", CHAFA_TERM_SEQ_BEGIN_TMUX_PASSTHROUGH)
      .value("CHAFA_TERM_SEQ_END_TMUX_PASSTHROUGH", CHAFA_TERM_SEQ_END_TMUX_PASSTHROUGH)
      .value("CHAFA_TERM_SEQ_BEGIN_KITTY_IMMEDIATE_VIRT_IMAGE_V1", CHAFA_TERM_SEQ_BEGIN_KITTY_IMMEDIATE_VIRT_IMAGE_V1);
  emscripten::enum_<ChafaTermInfoError>("ChafaTermInfoError")
      .value("CHAFA_TERM_INFO_ERROR_SEQ_TOO_LONG", CHAFA_TERM_INFO_ERROR_SEQ_TOO_LONG)
      .value("CHAFA_TERM_INFO_ERROR_BAD_ESCAPE", CHAFA_TERM_INFO_ERROR_BAD_ESCAPE)
      .value("CHAFA_TERM_INFO_ERROR_BAD_ARGUMENTS", CHAFA_TERM_INFO_ERROR_BAD_ARGUMENTS);
  emscripten::enum_<ChafaParseResult>("ChafaParseResult")
      .value("CHAFA_PARSE_SUCCESS", CHAFA_PARSE_SUCCESS)
      .value("CHAFA_PARSE_FAILURE", CHAFA_PARSE_FAILURE)
      .value("CHAFA_PARSE_AGAIN", CHAFA_PARSE_AGAIN);
}

#endif /* __CHAFA_BINDINGS__ */
