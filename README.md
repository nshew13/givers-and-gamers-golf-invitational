# givers-and-gamers-golf-invitational

- [Prerequisites](#prerequisites)
- [Use](#use)
  - [Install dependencies](#install-dependencies)
  - [Run local dev server](#run-local-dev-server)
- [Attribution](#attribution)
  - [Golf icon](#golf-icon)
  - [Windmill animation](#windmill-animation)
- [Under the hood](#under-the-hood)

## Prerequisites
* [Node](https://nodejs.org/en/download/) v16 LTS or later


## Use
All commands are expected to be run from the project root directory
(this directory), unless otherwise noted.

### Install dependencies
```shell
npm i
```

### Run local dev server
```shell
npm start
```
Browse to http://localhost:3000/ to see the app.

## Attribution

### Golf icon
<a href="https://www.flaticon.com/free-icons/golf" title="golf icons">Golf icons created by Talha Dogar - Flaticon</a>

### Windmill animation
Copyright (c) 2022 by Lewis Briffa (https://codepen.io/LewisBriffa/pen/QjWROG)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Under the hood

*Vite* used as a builder because of
[an issue](https://github.com/parcel-bundler/parcel/issues/7574) in Parcel
2.2.1.

File viewing requires a local server, because static file opening creates
XSRF issues with `script type="module"` (regardless of builder).