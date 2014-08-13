Middleout GRID 1.0.0
====

An Angular Module for grids and tables. Its very explicit and doesn't do any magic at all.

Features:

- Sorting
- Custom sorting keywords (you can use ASCENDING, asc, 0, etc)
- Default sorting direction (when you sort by a column which was not being sorted on)
- Filtering (you can use any 1 dimension object/array for filters)
- Customization of data loading (you define it explicitly)
- Pagination (besides the usual first page, last page, previous page, next page & is active page, automatically detects if the current page is not in the pages list anymore; if so then it makes a new request sending the user to the last possible page).
- Loading state
- Reloading API
- Driven by Configuration
- Ease of use (just a directive and a configuration service)


TO DO:

- Typescript implementation alongisde pure angular
- Definetely Typed (.d.ts) implementation & submission

HOW TO USE:

1. Download the mdo-grid.js
2. Place it & include it in your project
3. In your angular controller, inject the configuration service:
```.controller('ExampleCtrl', function(mdoGridConfig){ ... });```
