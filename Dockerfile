##################################################
## "build" stage
##################################################

FROM docker.io/hectorm/wasm:v53@sha256:3007f8898b1295c2e6576a64c3935d9cfc7a6cd3547878cd614d390ad45e0437 AS build

# Environment
ENV BUILDDIR=/tmp/build
ENV SYSROOT=/tmp/sysroot
ENV PKG_CONFIG_SYSROOT_DIR=${SYSROOT}
ENV PKG_CONFIG_LIBDIR=${SYSROOT}/lib/pkgconfig:${SYSROOT}/share/pkgconfig
ENV PKG_CONFIG_PATH=${PKG_CONFIG_LIBDIR}
ENV EM_PKG_CONFIG_PATH=${PKG_CONFIG_LIBDIR}
ENV CHOST=wasm32-unknown-emscripten
ENV CPPFLAGS='-Wdate-time'
ENV CFLAGS='-O3 -fwasm-exceptions -frandom-seed=42 -Wall -Wextra -Wformat -Werror=format-security'
ENV CXXFLAGS=${CFLAGS}
ENV LDFLAGS='-fwasm-exceptions'

# Build zlib
ARG ZLIB_TREEISH=v1.3
ARG ZLIB_REMOTE=https://github.com/madler/zlib.git
WORKDIR ${BUILDDIR}/dep/zlib/
RUN git clone "${ZLIB_REMOTE:?}" ./ \
	&& git checkout "${ZLIB_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emconfigure ./configure \
		--prefix="${SYSROOT:?}" \
		--libdir="${SYSROOT:?}"/lib \
		--static
RUN emmake make -j"$(nproc)" install
RUN pkg-config --static --exists --print-errors zlib

# Build libffi
ARG LIBFFI_TREEISH=5b1944b4ce4b03e28a5843d36812756168d66b08
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
ARG GLIB_TREEISH=2.78.1
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
		-D man=false \
		-D gtk_doc=false \
		-D tests=false \
		-D nls=disabled \
		-D selinux=disabled \
		-D xattr=false \
		-D libmount=disabled \
		-D glib_assert=false \
		-D glib_checks=false
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors glib-2.0

# Build libpng
ARG LIBPNG_TREEISH=v1.6.40
ARG LIBPNG_REMOTE=https://github.com/glennrp/libpng.git
WORKDIR ${BUILDDIR}/dep/libpng/
RUN git clone "${LIBPNG_REMOTE:?}" ./ \
	&& git checkout "${LIBPNG_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN emcmake cmake -G 'Ninja' -S ./ -B ./build/ \
		-D CMAKE_INSTALL_PREFIX="${SYSROOT:?}" \
		-D CMAKE_INSTALL_LIBDIR="${SYSROOT:?}"/lib \
		-D CMAKE_FIND_ROOT_PATH="${SYSROOT:?}" \
		-D CMAKE_FIND_ROOT_PATH_MODE_PACKAGE=BOTH \
		-D CMAKE_BUILD_TYPE=Release \
		-D PNG_STATIC=ON \
		-D PNG_SHARED=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libpng

# Build libjpeg-turbo
ARG LIBJPEG_TURBO_TREEISH=3.0.1
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
		-D ENABLE_SHARED=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libjpeg

# Build libwebp
ARG LIBWEBP_TREEISH=v1.3.2
ARG LIBWEBP_REMOTE=https://chromium.googlesource.com/webm/libwebp.git
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
		-D WEBP_BUILD_VWEBP=OFF \
		-D WEBP_BUILD_WEBPINFO=OFF \
		-D WEBP_BUILD_WEBPMUX=OFF \
		-D WEBP_BUILD_IMG2WEBP=OFF \
		-D WEBP_BUILD_GIF2WEBP=OFF \
		-D WEBP_BUILD_ANIM_UTILS=OFF \
		-D WEBP_BUILD_EXTRAS=OFF
RUN emmake ninja -C ./build/ install
RUN pkg-config --static --exists --print-errors libwebp

# Build Chafa
ARG CHAFA_TREEISH=5e77e15ebe916f529f075aa9d30c25dd9ea5b245
ARG CHAFA_REMOTE=https://github.com/hpjansson/chafa.git
WORKDIR ${BUILDDIR}/dep/chafa/
RUN git clone "${CHAFA_REMOTE:?}" ./ \
	&& git checkout "${CHAFA_TREEISH:?}" \
	&& git submodule update --init --recursive
RUN NOCONFIGURE=1 ./autogen.sh
RUN emconfigure ./configure \
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
		$(pkg-config --libs --cflags libpng) \
		$(pkg-config --libs --cflags libjpeg) \
		$(pkg-config --libs --cflags libwebp) \
		$(pkg-config --libs --cflags zlib) \
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
		-o "${BUILDDIR:?}"/dist/chafa.js

##################################################
## "dist" stage
##################################################

FROM scratch AS dist

COPY --from=build /tmp/build/dist/chafa.js /
COPY --from=build /tmp/build/dist/chafa.wasm /
