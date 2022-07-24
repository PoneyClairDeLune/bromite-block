#!/bin/bash
mkdir -p dist
mkdir -p proxy
# Remove the dev files
rm -rv dist/*
# Using esbuild to build all JS files
#esbuild --bundle src/index.js --outfile=dist/index.js --minify --sourcemap
#esbuild --bundle src/index.js --target=es6 --outfile=dist/index.es6.js --minify --sourcemap
ls -1 src | while IFS= read -r dir ; do
	if [ -e "src/${dir}/index.js" ] ; then
		shx live $dir --minify > /dev/null
	fi
done
rm -rv proxy/*.map
# Finalizing most builds
ls -1 src | while IFS= read -r dir ; do
	if [ -e "src/${dir}/prefixer.js" ] ; then
		cat src/${dir}/prefixer.js > dist/${dir}.js
	fi
	if [ -e "proxy/${dir}.js" ] ; then
		cat proxy/${dir}.js >> dist/${dir}.js
	fi
done
exit
