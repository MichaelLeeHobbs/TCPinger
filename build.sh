#!/usr/bin/env bash
yarn install
./node_modules/.bin/pkg tcpinger.js --output ./dist/tcpinger_linux_x86 --targets node8-linux-x86
./node_modules/.bin/pkg tcpinger.js --output ./dist/tcpinger_linux_x64 --targets node8-linux-x64

./node_modules/.bin/pkg tcpinger.js --output ./dist/tcpinger_win_x86 --targets node8-win-x86
./node_modules/.bin/pkg tcpinger.js --output ./dist/tcpinger_win_x64 --targets node8-win-x64

./node_modules/.bin/pkg tcpinger.js --output ./dist/tcpinger_freebsd_x86 --targets node8-freebsd-x86
./node_modules/.bin/pkg tcpinger.js --output ./dist/tcpinger_freebsd_x64 --targets node8-freebsd-x64

./node_modules/.bin/pkg tcpinger.js --output ./dist/tcpinger_macos_x86 --targets node8-macos-x86
./node_modules/.bin/pkg tcpinger.js --output ./dist/tcpinger_macos_x64 --targets node8-macos-x64