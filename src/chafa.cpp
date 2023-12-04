#include <cstdio>
#include <cstring>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

#include <jpeglib.h>
#include <png.h>
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
    png_image image;

    memset(&image, 0, sizeof(image));
    image.version = PNG_IMAGE_VERSION;

    if (png_image_begin_read_from_memory(&image, bytes.c_str(), bytes.size()) == 0) {
      png_image_free(&image);
      throw std::runtime_error("png_image_begin_read_from_memory failed");
    }

    image.format = PNG_FORMAT_RGBA;

    std::vector<std::uint8_t> buffer(PNG_IMAGE_SIZE(image));
    if (png_image_finish_read(&image, nullptr, buffer.data(), 0, nullptr) == 0) {
      png_image_free(&image);
      throw std::runtime_error("png_image_finish_read failed");
    }

    png_image_free(&image);

    return ImageDataLike{
        std::make_unsigned_t<std::uint32_t>(image.width),
        std::make_unsigned_t<std::uint32_t>(image.height),
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
  emscripten::function("_decode_webp", &decode_webp);
}
