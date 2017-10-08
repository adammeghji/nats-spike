#!/bin/bash

# run first time
protoc --ruby_out ./ruby *.proto

# then run every time
/root/go/bin/filewatcher -x 'ruby' protoc --ruby_out ./ruby *.proto
