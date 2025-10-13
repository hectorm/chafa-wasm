##################################################
## "build" stage
##################################################

FROM docker.io/hectorm/wasm:v66@sha256:f371486fecb26b11f6849fc7dad0bffd8895959cc5dc8b6424c327a15c7b321b AS build

# Environment
ENV BUILDDIR=/tmp/build
ENV SYSROOT=/tmp/sysroot
ENV PKG_CONFIG_SYSROOT_DIR=${SYSROOT}
ENV PKG_CONFIG_LIBDIR=${SYSROOT}/lib/pkgconfig:${SYSROOT}/share/pkgconfig
ENV PKG_CONFIG_PATH=${PKG_CONFIG_LIBDIR}
ENV EM_PKG_CONFIG_PATH=${PKG_CONFIG_LIBDIR}
ENV CHOST=wasm32-unknown-emscripten
ENV CPPFLAGS='-Wdate-time'
ENV CFLAGS='-O3 -msimd128 -fwasm-exceptions -sSUPPORT_LONGJMP=wasm -frandom-seed=42 -Wall -Wextra -Wformat -Werror=format-security'
ENV CXXFLAGS=${CFLAGS}
ENV LDFLAGS='-fwasm-exceptions -sSUPPORT_LONGJMP=wasm'

# Build zlib-ng
ARG ZLIB_NG_TREEISH=2.2.5
ARG ZLIB_NG_REMOTE=https://github.com/zlib-ng/zlib-ng.git
WORKDIR ${BUILDDIR}/dep/zlib-ng/
RUN git clone "${ZLIB_NG_REMOTE:?}" ./ \
	&& git checkout "${ZLIB_NG_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emcmake cmake -G 'Ninja' -S ./ -B ./build/ \
		-D CMAKE_INSTALL_PREFIX="${SYSROOT:?}" \
		-D CMAKE_INSTALL_LIBDIR="${SYSROOT:?}"/lib \
		-D CMAKE_FIND_ROOT_PATH="${SYSROOT:?}" \
		-D CMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH \
		-D CMAKE_BUILD_TYPE=Release \
		-D BUILD_SHARED_LIBS=OFF \
		-D ZLIB_COMPAT=ON \
		-D ZLIB_ENABLE_TESTS=OFF \
		-D ZLIBNG_ENABLE_TESTS=OFF \
		-D WITH_GTEST=OFF \
		-D WITH_RUNTIME_CPU_DETECTION=OFF \
		-D BASEARCH_X86_FOUND=ON \
		-D FORCE_SSE2=ON
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors zlib

# Build brotli
ARG BROTLI_TREEISH=v1.1.0
ARG BROTLI_REMOTE=https://github.com/google/brotli.git
WORKDIR ${BUILDDIR}/dep/brotli/
RUN git clone "${BROTLI_REMOTE:?}" ./ \
	&& git checkout "${BROTLI_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emcmake cmake -G 'Ninja' -S ./ -B ./build/ \
		-D CMAKE_INSTALL_PREFIX="${SYSROOT:?}" \
		-D CMAKE_INSTALL_LIBDIR="${SYSROOT:?}"/lib \
		-D CMAKE_FIND_ROOT_PATH="${SYSROOT:?}" \
		-D CMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH \
		-D CMAKE_BUILD_TYPE=Release \
		-D BUILD_SHARED_LIBS=OFF \
		-D BUILD_TESTING=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libbrotlidec

# Build libffi
ARG LIBFFI_TREEISH=v3.5.2
ARG LIBFFI_REMOTE=https://github.com/libffi/libffi.git
WORKDIR ${BUILDDIR}/dep/libffi/
RUN git clone "${LIBFFI_REMOTE:?}" ./ \
	&& git checkout "${LIBFFI_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN NOCONFIGURE=1 ./autogen.sh
RUN emconfigure ./configure \
		--prefix="${SYSROOT:?}" \
		--libdir="${SYSROOT:?}"/lib \
		--host="${CHOST:?}" \
		--enable-static \
		--disable-shared \
		--disable-docs
RUN emmake make -j"$(nproc)" install
RUN pkg-config --static --exists --print-errors libffi

# Build glib
ARG GLIB_TREEISH=2.85.3
ARG GLIB_REMOTE=https://github.com/GNOME/glib.git
WORKDIR ${BUILDDIR}/dep/glib/
RUN git clone "${GLIB_REMOTE:?}" ./ \
	&& git checkout "${GLIB_TREEISH:?}" \
	&& git submodule update --init --recursive
# Apply patch for Emscripten (https://github.com/kleisauke/glib)
RUN curl -sSL "https://github.com/GNOME/glib/compare/${GLIB_TREEISH:?}...kleisauke:wasm-vips-${GLIB_TREEISH:?}.patch" | patch -p1
RUN emconfigure meson setup ./build/ \
		--prefix="${SYSROOT:?}" \
		--libdir="${SYSROOT:?}"/lib \
		--cross-file="${CHOST:?}" \
		--buildtype=release \
		--default-library=static \
		--force-fallback-for=gvdb,zlib \
		-D man-pages=disabled \
		-D documentation=false \
		-D tests=false \
		-D nls=disabled \
		-D selinux=disabled \
		-D xattr=false \
		-D libmount=disabled \
		-D glib_assert=false \
		-D glib_checks=false
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors glib-2.0

# Build highway
ARG HIGHWAY_TREEISH=1.3.0
ARG HIGHWAY_REMOTE=https://github.com/google/highway.git
WORKDIR ${BUILDDIR}/dep/highway/
RUN git clone "${HIGHWAY_REMOTE:?}" ./ \
	&& git checkout "${HIGHWAY_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emcmake cmake -G 'Ninja' -S ./ -B ./build/ \
		-D CMAKE_INSTALL_PREFIX="${SYSROOT:?}" \
		-D CMAKE_INSTALL_LIBDIR="${SYSROOT:?}"/lib \
		-D CMAKE_FIND_ROOT_PATH="${SYSROOT:?}" \
		-D CMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH \
		-D CMAKE_BUILD_TYPE=Release \
		-D BUILD_SHARED_LIBS=OFF \
		-D BUILD_TESTING=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libhwy

# Build libspng
ARG LIBSPNG_TREEISH=v0.7.4
ARG LIBSPNG_REMOTE=https://github.com/randy408/libspng.git
WORKDIR ${BUILDDIR}/dep/libspng/
RUN git clone "${LIBSPNG_REMOTE:?}" ./ \
	&& git checkout "${LIBSPNG_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emcmake cmake -G 'Ninja' -S ./ -B ./build/ \
		-D CMAKE_INSTALL_PREFIX="${SYSROOT:?}" \
		-D CMAKE_INSTALL_LIBDIR="${SYSROOT:?}"/lib \
		-D CMAKE_FIND_ROOT_PATH="${SYSROOT:?}" \
		-D CMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH \
		-D CMAKE_BUILD_TYPE=Release \
		-D CMAKE_C_FLAGS="${CFLAGS:-} -msse4.2 -DSPNG_SSE=4 -D__x86_64__" \
		-D SPNG_STATIC=ON \
		-D SPNG_SHARED=OFF \
		-D BUILD_EXAMPLES=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libspng_static

# Build libjpeg-turbo
ARG LIBJPEG_TURBO_TREEISH=3.1.1
ARG LIBJPEG_TURBO_REMOTE=https://github.com/libjpeg-turbo/libjpeg-turbo.git
WORKDIR ${BUILDDIR}/dep/libjpeg-turbo/
RUN git clone "${LIBJPEG_TURBO_REMOTE:?}" ./ \
	&& git checkout "${LIBJPEG_TURBO_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emcmake cmake -G 'Ninja' -S ./ -B ./build/ \
		-D CMAKE_INSTALL_PREFIX="${SYSROOT:?}" \
		-D CMAKE_INSTALL_LIBDIR="${SYSROOT:?}"/lib \
		-D CMAKE_FIND_ROOT_PATH="${SYSROOT:?}" \
		-D CMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH \
		-D CMAKE_BUILD_TYPE=Release \
		-D ENABLE_STATIC=ON \
		-D ENABLE_SHARED=OFF \
		-D WITH_JPEG8=ON \
		-D WITH_TURBOJPEG=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libjpeg

# Build libjxl
ARG LIBJXL_TREEISH=v0.11.1
ARG LIBJXL_REMOTE=https://github.com/libjxl/libjxl.git
WORKDIR ${BUILDDIR}/dep/libjxl/
RUN git clone "${LIBJXL_REMOTE:?}" ./ \
	&& git checkout "${LIBJXL_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emcmake cmake -G 'Ninja' -S ./ -B ./build/ \
		-D CMAKE_INSTALL_PREFIX="${SYSROOT:?}" \
		-D CMAKE_INSTALL_LIBDIR="${SYSROOT:?}"/lib \
		-D CMAKE_FIND_ROOT_PATH="${SYSROOT:?}" \
		-D CMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH \
		-D CMAKE_BUILD_TYPE=Release \
		-D JPEGXL_STATIC=ON \
		-D JPEGXL_FORCE_SYSTEM_BROTLI=ON \
		-D JPEGXL_FORCE_SYSTEM_HWY=ON \
		-D JPEGXL_BUNDLE_LIBPNG=OFF \
		-D JPEGXL_ENABLE_JPEGLI=OFF \
		-D JPEGXL_ENABLE_MANPAGES=OFF \
		-D JPEGXL_ENABLE_DOXYGEN=OFF \
		-D JPEGXL_ENABLE_TOOLS=OFF \
		-D JPEGXL_ENABLE_VIEWERS=OFF \
		-D JPEGXL_ENABLE_DEVTOOLS=OFF \
		-D JPEGXL_ENABLE_EXAMPLES=OFF \
		-D JPEGXL_ENABLE_COVERAGE=OFF \
		-D JPEGXL_ENABLE_FUZZERS=OFF \
		-D JPEGXL_ENABLE_BENCHMARK=OFF \
		-D BUILD_TESTING=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libjxl

# Build libwebp
ARG LIBWEBP_TREEISH=v1.6.0
ARG LIBWEBP_REMOTE=https://github.com/webmproject/libwebp.git
WORKDIR ${BUILDDIR}/dep/libwebp/
RUN git clone "${LIBWEBP_REMOTE:?}" ./ \
	&& git checkout "${LIBWEBP_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emcmake cmake -G 'Ninja' -S ./ -B ./build/ \
		-D CMAKE_INSTALL_PREFIX="${SYSROOT:?}" \
		-D CMAKE_INSTALL_LIBDIR="${SYSROOT:?}"/lib \
		-D CMAKE_FIND_ROOT_PATH="${SYSROOT:?}" \
		-D CMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH \
		-D CMAKE_BUILD_TYPE=Release \
		-D BUILD_SHARED_LIBS=OFF \
		-D WEBP_USE_THREAD=OFF \
		-D WEBP_BUILD_CWEBP=OFF \
		-D WEBP_BUILD_DWEBP=OFF \
		-D WEBP_BUILD_GIF2WEBP=OFF \
		-D WEBP_BUILD_IMG2WEBP=OFF \
		-D WEBP_BUILD_VWEBP=OFF \
		-D WEBP_BUILD_WEBPINFO=OFF \
		-D WEBP_BUILD_LIBWEBPMUX=OFF \
		-D WEBP_BUILD_WEBPMUX=OFF \
		-D WEBP_BUILD_ANIM_UTILS=OFF \
		-D WEBP_BUILD_EXTRAS=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libwebp

# Build Chafa
ARG CHAFA_TREEISH=1.16.2
ARG CHAFA_REMOTE=https://github.com/hpjansson/chafa.git
WORKDIR ${BUILDDIR}/dep/chafa/
RUN git clone "${CHAFA_REMOTE:?}" ./ \
	&& git checkout "${CHAFA_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN NOCONFIGURE=1 ./autogen.sh
RUN emconfigure ./configure \
		CFLAGS="${CFLAGS-} -USMOL_WITH_AVX2" \
		--prefix="${SYSROOT:?}" \
		--libdir="${SYSROOT:?}"/lib \
		--host="${CHOST:?}" \
		--enable-static \
		--disable-shared \
		--disable-man \
		--disable-gtk-doc \
		--without-tools
RUN emmake make -j"$(nproc)" install
RUN pkg-config --static --exists --print-errors chafa

# Build Chafa WebAssembly module
COPY --chown=wasm:wasm ./src/ ${BUILDDIR}/src/
WORKDIR ${BUILDDIR}/src/
RUN mkdir "${BUILDDIR:?}"/dist/
RUN em++ ${CPPFLAGS-} ${CXXFLAGS-} ${LDFLAGS-} \
		"${BUILDDIR:?}"/src/chafa.cpp \
		--post-js "${BUILDDIR:?}"/src/chafa.js \
		-I"${SYSROOT:?}"/include \
		-I"${SYSROOT:?}"/include/chafa \
		-I"${SYSROOT:?}"/lib/chafa/include \
		-I"${SYSROOT:?}"/include/glib-2.0 \
		-L"${SYSROOT:?}"/lib \
		-I"${SYSROOT:?}"/lib/glib-2.0/include \
		-lembind -lchafa -lglib-2.0 \
		$(pkg-config --libs --cflags zlib) \
		$(pkg-config --libs --cflags libbrotlicommon) \
		$(pkg-config --libs --cflags libbrotlidec) \
		$(pkg-config --libs --cflags libhwy) \
		$(pkg-config --libs --cflags libspng_static) \
		$(pkg-config --libs --cflags libjpeg) \
		$(pkg-config --libs --cflags libjxl) \
		$(pkg-config --libs --cflags libwebp) \
		-s ENVIRONMENT=web,worker,node \
		-s MODULARIZE=1 \
		-s EXPORT_ES6=1 \
		-s EXPORT_NAME=Chafa \
		-s EXPORTED_FUNCTIONS=["$(paste -sd, "${BUILDDIR:?}"/src/exported_functions.txt)"] \
		-s EXPORTED_RUNTIME_METHODS=["$(paste -sd, "${BUILDDIR:?}"/src/exported_runtime_methods.txt)"] \
		-s STRICT=1 \
		-s WASM_BIGINT=1 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s IGNORE_MISSING_MAIN=1 \
		-s DYNAMIC_EXECUTION=0 \
		-s FILESYSTEM=0 \
		-s POLYFILL=0 \
		--closure 1 \
		--extern-pre-js "${BUILDDIR:?}"/src/pre.txt \
		-o "${BUILDDIR:?}"/dist/chafa.js

# Add "node:" prefix to "module" import call to fix an error with Deno
RUN sed -i 's|import("module")|import("node:module")|g' "${BUILDDIR:?}"/dist/chafa.js

##################################################
## "dist" stage
##################################################

FROM scratch AS dist

COPY --from=build /tmp/build/dist/chafa.js /
COPY --from=build /tmp/build/dist/chafa.wasm /
