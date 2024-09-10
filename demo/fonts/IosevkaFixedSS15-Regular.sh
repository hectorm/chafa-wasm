#!/bin/sh

WORKDIR=$(CDPATH='' cd -- "$(dirname -- "${0:?}")" && pwd -P)

RELEASE_JSON=$(curl -sSfL 'https://api.github.com/repos/be5invis/Iosevka/releases/latest')
PKG_URL_PARSER='.assets[] | select(.name | test("^PkgWebFont-Unhinted-IosevkaFixedSS15-[0-9]+(\\.[0-9]+)*\\.zip$")?) | .browser_download_url'
PKG_URL=$(printf '%s' "${RELEASE_JSON:?}" | jq -r "${PKG_URL_PARSER:?}")

curl -sSfL "${PKG_URL:?}" | bsdtar -x --strip-components=1 -C "${WORKDIR:?}" './WOFF2-Unhinted/IosevkaFixedSS15-Regular.woff2'
