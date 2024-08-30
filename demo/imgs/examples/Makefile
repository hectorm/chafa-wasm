#!/usr/bin/make -f

SHELL := /bin/sh
.SHELLFLAGS := -euc

pnms := $(patsubst %.png,%.pnm,$(wildcard *.png))
jpgs := $(patsubst %.png,%.jpg,$(wildcard *.png))
jxls := $(patsubst %.png,%.jxl,$(wildcard *.png))
webps := $(patsubst %.png,%.webp,$(wildcard *.png))
avifs := $(patsubst %.png,%.avif,$(wildcard *.png))

.PHONY: all
all: build

.PHONY: build
build: $(jpgs) $(jxls) $(webps)

%.pnm: %.png
	png2pnm "$<" "$@"

%.jpg: %.pnm
	cjpeg -lossless 7,0 -outfile "$@" "$<"

%.jxl: %.png
	cjxl -q 100 -e 9 "$<" "$@"

%.webp: %.png
	cwebp -lossless -z 9 -exact -o "$@" "$<"

%.avif: %.png
	avifenc --lossless "$<" "$@"

.PHONY: clean
clean:
	rm -f $(pnms) $(jpgs) $(jxls) $(webps) $(avifs)
