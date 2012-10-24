Page List
=========

## Introduction

Page List is a utility to present a "table of contents" of different HTML pages that have to be presented but are not linked together (most likely because these are nonintegrated HTML files).

It works with an `iFrame` injected into the DOM and generating a "table of contents" of links from an array of JSON objects that has the `title`, `url` and `category`. The iFrame is stretched to the width and height of the browser and then an overflow: hidden is applied to the original body so it uses the iFrame scrollbars (if any).

To enable the page list, a button is appended into the DOM to toggle the iFrame over to the right to reveal the content. When a link is clicked on, the url is then loaded into the iFrame.

The array for the links is manually created but a simple PHP script that looked for the index files of a folder could help generate the array.

## TODO

- Apply settings control
- Use cookies to save settings
- Live search
- Use HTML5 history api for when changing links
- Documentation
- Examples with a PHP script
