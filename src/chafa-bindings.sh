#!/bin/sh

set -eu

CHAFA_SRC_DIR=${1:?}

cat <<-'EOF'
	#ifndef __CHAFA_BINDINGS__
	#define __CHAFA_BINDINGS__

	#include <chafa.h>

	#include <emscripten/bind.h>
	#include <emscripten/val.h>

	EMSCRIPTEN_BINDINGS(Chafa) {
EOF

for f in "${CHAFA_SRC_DIR:?}"/chafa/chafa-*.[ch]; do
	if [ -e "${f:?}" ]; then
		cat "${f:?}"
	fi
done | awk "$(cat <<'EOF'
	/^\/\*\*$/ {
		comment = 1;
	}
	comment && /^ +\* +Chafa[0-9A-Za-z_]+:$/ {
		enum = substr($2, 1, length($2) - 1);
		printf("%s", "  emscripten::enum_<" enum ">(\"" enum "\")");
	}
	comment && enum && /^ +\* +@CHAFA_[0-9A-Z_]+: / {
		value = substr($2, 2, length($2) - 2);
		printf("\n%s", "      .value(\"" value "\", " value ")");
	}
	/^ +\*\*\/$/ {
		if (enum) printf("%s\n", ";");
		comment = 0;
		enum = "";
	}
EOF
)"

cat <<-'EOF'
	}

	#endif /* __CHAFA_BINDINGS__ */
EOF
