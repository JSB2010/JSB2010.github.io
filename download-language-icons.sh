#!/bin/bash

# Create directories
mkdir -p public/images/languages
mkdir -p public/images/languages/patterns

# Download language SVGs from Simple Icons
# JavaScript
curl -s https://cdn.simpleicons.org/javascript -o public/images/languages/javascript.svg

# TypeScript
curl -s https://cdn.simpleicons.org/typescript -o public/images/languages/typescript.svg

# Python
curl -s https://cdn.simpleicons.org/python -o public/images/languages/python.svg

# Java
curl -s https://cdn.simpleicons.org/java -o public/images/languages/java.svg

# C#
curl -s https://cdn.simpleicons.org/csharp -o public/images/languages/csharp.svg

# Go
curl -s https://cdn.simpleicons.org/go -o public/images/languages/go.svg

# Ruby
curl -s https://cdn.simpleicons.org/ruby -o public/images/languages/ruby.svg

# PHP
curl -s https://cdn.simpleicons.org/php -o public/images/languages/php.svg

# C
curl -s https://cdn.simpleicons.org/c -o public/images/languages/c.svg

# C++
curl -s https://cdn.simpleicons.org/cplusplus -o public/images/languages/cpp.svg

# Rust
curl -s https://cdn.simpleicons.org/rust -o public/images/languages/rust.svg

# Swift
curl -s https://cdn.simpleicons.org/swift -o public/images/languages/swift.svg

# Kotlin
curl -s https://cdn.simpleicons.org/kotlin -o public/images/languages/kotlin.svg

# Dart
curl -s https://cdn.simpleicons.org/dart -o public/images/languages/dart.svg

# HTML
curl -s https://cdn.simpleicons.org/html5 -o public/images/languages/html.svg

# CSS
curl -s https://cdn.simpleicons.org/css3 -o public/images/languages/css.svg

# React
curl -s https://cdn.simpleicons.org/react -o public/images/languages/react.svg

# Vue
curl -s https://cdn.simpleicons.org/vuedotjs -o public/images/languages/vue.svg

# Angular
curl -s https://cdn.simpleicons.org/angular -o public/images/languages/angular.svg

# Svelte
curl -s https://cdn.simpleicons.org/svelte -o public/images/languages/svelte.svg

# Node.js
curl -s https://cdn.simpleicons.org/nodedotjs -o public/images/languages/nodejs.svg

# R
curl -s https://cdn.simpleicons.org/r -o public/images/languages/r.svg

# Shell
curl -s https://cdn.simpleicons.org/gnubash -o public/images/languages/shell.svg

# PowerShell
curl -s https://cdn.simpleicons.org/powershell -o public/images/languages/powershell.svg

# Bash
curl -s https://cdn.simpleicons.org/gnubash -o public/images/languages/bash.svg

# Markdown
curl -s https://cdn.simpleicons.org/markdown -o public/images/languages/markdown.svg

# JSON
curl -s https://cdn.simpleicons.org/json -o public/images/languages/json.svg

# YAML
curl -s https://cdn.simpleicons.org/yaml -o public/images/languages/yaml.svg

# Flutter
curl -s https://cdn.simpleicons.org/flutter -o public/images/languages/flutter.svg

# SASS/SCSS
curl -s https://cdn.simpleicons.org/sass -o public/images/languages/sass.svg

# Julia
curl -s https://cdn.simpleicons.org/julia -o public/images/languages/julia.svg

echo "Downloaded language icons successfully!"
