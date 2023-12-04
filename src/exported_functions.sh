#!/bin/sh

set -eu

CHAFA_SRC_DIR=${1:?}

cat <<-'EOF'
	_malloc
	_realloc
	_free
	_g_string_free_and_steal
EOF

for f in "${CHAFA_SRC_DIR:?}"/chafa/chafa-*.[ch]; do
	if [ -e "${f:?}" ]; then
		cat "${f:?}"
	fi
done | awk "$(cat <<-'EOF'
	/^\/\*\*$/ {
		comment = 1;
	}
	comment && /^ +\* +chafa_[0-9a-z_]+:$/ {
		name = substr($2, 1, length($2) - 1);
		printf("%s\n", "_" name);
	}
	/^ +\*\*\/$/ {
		comment = 0;
	}
EOF
)"
