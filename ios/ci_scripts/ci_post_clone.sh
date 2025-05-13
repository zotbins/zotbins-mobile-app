#!/bin/bash
curl -L https://nodejs.org/dist/v18.17.1/node-v18.17.1-darwin-x64.tar.gz -o node.tar.gz
mkdir -p /tmp/nodejs
tar -xzf node.tar.gz -C /tmp/nodejs --strip-components=1
export PATH="/tmp/nodejs/bin:$PATH"

npm install

brew install cocoapods

pod install
