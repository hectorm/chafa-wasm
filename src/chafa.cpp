#include <cstdio>
#include <cstring>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

#include <jpeglib.h>
#include <jxl/decode.h>
#include <spng.h>
#include <webp/decode.h>

#include <emscripten/bind.h>
#include <emscripten/val.h>

#include "./chafa-bindings.hpp"

const emscripten::val Uint8ClampedArray = emscripten::val::global("Uint8ClampedArray");

struct ImageDataLike {
  std::uint32_t width;
  std::uint32_t height;
  emscripten::val data;
};

ImageDataLike decode_png(std::string bytes) {
  try {
    spng_ctx *ctx = spng_ctx_new(0);
    if (ctx == nullptr) {
      throw std::runtime_error("spng_ctx_new failed");
    }

    if (spng_set_png_buffer(ctx, reinterpret_cast<const std::uint8_t *>(bytes.c_str()), bytes.size()) != SPNG_OK) {
      spng_ctx_free(ctx);
      throw std::runtime_error("spng_set_png_buffer failed");
    }

    size_t out_size{};
    if (spng_decoded_image_size(ctx, SPNG_FMT_RGBA8, &out_size) != SPNG_OK) {
      spng_ctx_free(ctx);
      throw std::runtime_error("spng_decoded_image_size failed");
    }

    std::vector<std::uint8_t> buffer(out_size);
    if (spng_decode_image(ctx, buffer.data(), out_size, SPNG_FMT_RGBA8, 0) != SPNG_OK) {
      spng_ctx_free(ctx);
      throw std::runtime_error("spng_decode_image failed");
    }

    spng_ihdr ihdr{};
    if (spng_get_ihdr(ctx, &ihdr) != SPNG_OK) {
      spng_ctx_free(ctx);
      throw std::runtime_error("spng_get_ihdr failed");
    }

    spng_ctx_free(ctx);

    return ImageDataLike{
        std::make_unsigned_t<std::uint32_t>(ihdr.width),
        std::make_unsigned_t<std::uint32_t>(ihdr.height),
        Uint8ClampedArray.new_(emscripten::typed_memory_view(buffer.size(), buffer.data()))};
  } catch (std::exception &e) {
    std::cerr << e.what() << std::endl;
    return ImageDataLike{0, 0, Uint8ClampedArray.new_()};
  }
}

ImageDataLike decode_jpeg(std::string bytes) {
  try {
    struct jpeg_decompress_struct cinfo;
    struct jpeg_error_mgr jerr;

    cinfo.err = jpeg_std_error(&jerr);
    jerr.error_exit = [](j_common_ptr cinfo) {
      char msg[JMSG_LENGTH_MAX];
      (*cinfo->err->format_message)(cinfo, msg);
      throw std::runtime_error(msg);
    };

    jpeg_create_decompress(&cinfo);
    jpeg_mem_src(&cinfo, reinterpret_cast<const std::uint8_t *>(bytes.c_str()), bytes.size());

    if (jpeg_read_header(&cinfo, TRUE) != JPEG_HEADER_OK) {
      jpeg_destroy_decompress(&cinfo);
      throw std::runtime_error("jpeg_read_header failed");
    }

    cinfo.out_color_space = JCS_EXT_RGBA;

    if (jpeg_start_decompress(&cinfo) == FALSE) {
      jpeg_destroy_decompress(&cinfo);
      throw std::runtime_error("jpeg_start_decompress failed");
    }

    std::vector<std::uint8_t> buffer(cinfo.output_width * cinfo.output_height * cinfo.output_components);
    std::uint8_t *ptr = buffer.data();
    std::uint32_t stride = cinfo.output_width * cinfo.output_components;
    while (cinfo.output_scanline < cinfo.output_height) {
      if (jpeg_read_scanlines(&cinfo, &ptr, 1) != 1) {
        jpeg_destroy_decompress(&cinfo);
        throw std::runtime_error("jpeg_read_scanlines failed");
      }
      ptr += stride;
    }

    if (jpeg_finish_decompress(&cinfo) == FALSE) {
      jpeg_destroy_decompress(&cinfo);
      throw std::runtime_error("jpeg_finish_decompress failed");
    }

    jpeg_destroy_decompress(&cinfo);

    return ImageDataLike{
        std::make_unsigned_t<std::uint32_t>(cinfo.output_width),
        std::make_unsigned_t<std::uint32_t>(cinfo.output_height),
        Uint8ClampedArray.new_(emscripten::typed_memory_view(buffer.size(), buffer.data()))};
  } catch (std::exception &e) {
    std::cerr << e.what() << std::endl;
    return ImageDataLike{0, 0, Uint8ClampedArray.new_()};
  }
}

ImageDataLike decode_jpegxl(std::string bytes) {
  try {
    JxlDecoder *decoder = JxlDecoderCreate(nullptr);
    if (decoder == nullptr) {
      throw std::runtime_error("JxlDecoderCreate failed");
    }

    if (JxlDecoderSubscribeEvents(decoder, JXL_DEC_BASIC_INFO | JXL_DEC_FULL_IMAGE) != JXL_DEC_SUCCESS) {
      JxlDecoderDestroy(decoder);
      throw std::runtime_error("JxlDecoderSubscribeEvents failed");
    }

    if (JxlDecoderSetInput(decoder, reinterpret_cast<const std::uint8_t *>(bytes.c_str()), bytes.size()) != JXL_DEC_SUCCESS) {
      JxlDecoderDestroy(decoder);
      throw std::runtime_error("JxlDecoderSetInput failed");
    }

    if (JxlDecoderProcessInput(decoder) != JXL_DEC_BASIC_INFO) {
      JxlDecoderDestroy(decoder);
      throw std::runtime_error("JxlDecoderProcessInput failed");
    }

    JxlBasicInfo info;
    if (JxlDecoderGetBasicInfo(decoder, &info) != JXL_DEC_SUCCESS) {
      JxlDecoderDestroy(decoder);
      throw std::runtime_error("JxlDecoderGetBasicInfo failed");
    }

    std::vector<std::uint8_t> buffer(info.xsize * info.ysize * 4);
    JxlPixelFormat format = {4, JXL_TYPE_UINT8, JXL_LITTLE_ENDIAN, 0};
    if (JxlDecoderSetImageOutBuffer(decoder, &format, buffer.data(), buffer.size()) != JXL_DEC_SUCCESS) {
      JxlDecoderDestroy(decoder);
      throw std::runtime_error("JxlDecoderSetImageOutBuffer failed");
    }

    if (JxlDecoderProcessInput(decoder) != JXL_DEC_FULL_IMAGE) {
      JxlDecoderDestroy(decoder);
      throw std::runtime_error("JxlDecoderProcessInput failed");
    }

    JxlDecoderDestroy(decoder);

    return ImageDataLike{
        std::make_unsigned_t<std::uint32_t>(info.xsize),
        std::make_unsigned_t<std::uint32_t>(info.ysize),
        Uint8ClampedArray.new_(emscripten::typed_memory_view(buffer.size(), buffer.data()))};
  } catch (std::exception &e) {
    std::cerr << e.what() << std::endl;
    return ImageDataLike{0, 0, Uint8ClampedArray.new_()};
  }
}

ImageDataLike decode_webp(std::string bytes) {
  try {
    WebPDecoderConfig config;
    WebPInitDecoderConfig(&config);

    if (WebPGetFeatures(reinterpret_cast<const std::uint8_t *>(bytes.c_str()), bytes.size(), &config.input) != VP8_STATUS_OK) {
      WebPFreeDecBuffer(&config.output);
      throw std::runtime_error("WebPGetFeatures failed");
    }

    std::vector<std::uint8_t> buffer(config.input.width * config.input.height * 4);

    config.output.colorspace = MODE_RGBA;
    config.output.u.RGBA.rgba = buffer.data();
    config.output.u.RGBA.stride = config.input.width * 4;
    config.output.u.RGBA.size = buffer.size();
    config.output.is_external_memory = 1;

    if (WebPDecode(reinterpret_cast<const std::uint8_t *>(bytes.c_str()), bytes.size(), &config) != VP8_STATUS_OK) {
      WebPFreeDecBuffer(&config.output);
      throw std::runtime_error("WebPDecode failed");
    }

    WebPFreeDecBuffer(&config.output);

    return ImageDataLike{
        std::make_unsigned_t<std::uint32_t>(config.input.width),
        std::make_unsigned_t<std::uint32_t>(config.input.height),
        Uint8ClampedArray.new_(emscripten::typed_memory_view(buffer.size(), buffer.data()))};
  } catch (std::exception &e) {
    std::cerr << e.what() << std::endl;
    return ImageDataLike{0, 0, Uint8ClampedArray.new_()};
  }
}

EMSCRIPTEN_BINDINGS(Util) {
  emscripten::value_object<ImageDataLike>("ImageDataLike")
      .field("width", &ImageDataLike::width)
      .field("height", &ImageDataLike::height)
      .field("data", &ImageDataLike::data);
  emscripten::function("_decode_png", &decode_png);
  emscripten::function("_decode_jpeg", &decode_jpeg);
  emscripten::function("_decode_jpegxl", &decode_jpegxl);
  emscripten::function("_decode_webp", &decode_webp);
}
