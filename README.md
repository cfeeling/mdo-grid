Middleout GRID
====

An Angular Module for grids and tables. Its very explicit and doesn't do any magic at all.

UPDATE ON 15 Aug 2014:
RELEASE 1.0.1
- Doesn't do automatic loading of data. Usefull for the cases where you want to inject your initial data in the controller so you don't have the grid flicker.
- Fixed a bug in the pagination system
- Added 2 more options on the mdoGridConfig:

```setInitialCount(number)```

and

```setInitialData(number)```

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
- Allows usage of tables, divs or anything you like. It's completely up to you on how you use it.


TO DO:

- Typescript implementation alongisde pure angular
- Definetely Typed (.d.ts) implementation & submission
- Test multiple grids in the same page and/or different pages in the app.



HOW TO USE:

1. Download the mdo-grid.js
2. Place it & include it in your project like this:

```.module('app', [ ... 'mdo.grid' ...]);```

3. In your angular controller, inject the configuration service:

```.controller('ExampleCtrl', function(mdoGridConfig){ ... });```

4. Configure the plugin. Below is an example of a FULL configuration, inside a controller:

```

// Assuming you have injected your initial data from the route's resolve feature
initialData = [someObject, someOtherObject];
initialDataCount = 100;

// Some object that contains the filters
var filters = {
	email: null
};

// Define the sorting
mdoGridConfig.setSorting({ 'fname': 'DESC' });

// Define the sorting direction keywords + default sorting direction
mdoGridConfig.setSortingKeywords('ASC', 'DESC', 'ASC');

// Force the grid to use this data count w/o doing any request
mdoGridConfig.setInitialCount(initialDataCount);

// Force the grid to use this data w/o doing any request
mdoGridConfig.setInitialData(initialData);

// Send the filters to the view
$scope.filters = filters;

// Setup the nb. of items per page we want to show initially
$scope.countPerPage = 2;

// Define the filters
mdoGridConfig.setFilters(filters);

// Define the nb of items per page
mdoGridConfig.setNbOfItemsPerPage(2);

// Define the get data function where you load your data in an async mode
mdoGridConfig.getData = function(defered, params, $grid) {
	// custom API that loads a list of data
	// the params is an object with a key/value system.
	// An example request looks like this:
	// example.com?itemsPerPage=1&page=1&sorting%5Bfname%5D=DESC&filters%5Bemail%5D=asd

	exampleSvc.listUsers( params ).then(function(result) {

		// tell the grid how many total items we have
		$grid.setTotalItemsCount(result.count);

		// tell the grid what items it should display
		$grid.setItems(result.data);

		defered.resolve();
	});

	// important since the internals of the grid depend on this
	return defered.promise;
};

// If you did not load your data initially, you want to use the method below to force the
// grid to actually load your data
// mdoGridConfig.reload();


// Send the grid config to the view
$scope.config = mdoGridConfig;

// If we change the nb of items per page, change it also in the grid
$scope.$watch('countPerPage', function(newVal, oldVal){
	mdoGridConfig.setNbOfItemsPerPage(newVal);
});

// Example usage of filters. Most of the code below is just an example on how to filter on some input value, waiting 500ms before triggering a reload. Of course, you are free to just hit the reload on change, instead of waiting with the $timeout service
var filterTimeout;

$scope.$watchCollection('filters', function(newValue, oldValue){
	if (newValue !== oldValue) {

		if (filterTimeout) {
			$timeout.cancel(filterTimeout);
		}

		filterTimeout = $timeout(function(){
			mdoGridConfig.filters = newValue;
			mdoGridConfig.reload();
		}, 500);
	}
});

// A simple example of reloading the grid action
$scope.reload = function() {
	mdoGridConfig.reload();
}
```

5. Define your view as following (please note this is an example; you can use your own html structure)

```
<!-- some view.html -->
<table mdo-grid="config" ng-hide="$grid.isLoading || $grid.total == 0">
	<thead>
		<tr>
			<th
					ng-class="{ 'sorting_asc': $grid.isSortBy('fname', 'ASC'), 'sorting_desc': $grid.isSortBy('fname', 'DESC') }"
					ng-click="$grid.sortBy('fname')" >
				User Name
			</th>
			<th
					ng-class="{ 'sorting_asc': $grid.isSortBy('email', 'ASC'), 'sorting_desc': $grid.isSortBy('email', 'DESC') }"
					ng-click="$grid.sortBy('email')" >
				Email
			</th>
			<th
					ng-class="{ 'sorting_asc': $grid.isSortBy('created_at', 'ASC'), 'sorting_desc': $grid.isSortBy('created_at', 'DESC') }"
					ng-click="$grid.sortBy('created_at')" >
				Created At
			</th>
		</tr>
	</thead>
	<tbody>
		<tr ng-repeat="user in $grid.data">
			<td>{{ user.fname + ' ' + user.lname }}</td>
			<td>{{ user.email }}</td>
			<td>{{ user.created_at }}</td>
		</tr>
	</tbody>
</table>
<br />
Showing <strong>{{ $grid.total > 0 ? $grid.page * $grid.count - $grid.count + 1 : 0 }}</strong> to <strong>{{ $grid.page * $grid.count > $grid.total ? $grid.total : $grid.page * $grid.count  }}</strong> of <strong>{{ $grid.total}}</strong> users.
<br />
<div ng-include="'table-pagination.html'"></div>
```

and the code for the table pagination view is:

```
<ul class="pagination">
    <li ng-class="{'disabled': $grid.page == $grid.firstPage }" ng-if="$grid.firstPage">
         <a ng-if="$grid.page != $grid.firstPage" ng-click="$grid.setPage($grid.firstPage)" ng-href="">
            &laquo;  &laquo;
         </a>
        <span ng-if="$grid.page == $grid.firstPage">&laquo;  &laquo;</span>
    </li>
    <li ng-class="{'disabled': $grid.page == $grid.firstPage }" ng-if="$grid.previousPage">
        <a ng-if="$grid.page != $grid.firstPage" ng-click="$grid.setPage($grid.previousPage)" ng-href="">
            &laquo;
         </a>
        <span ng-if="$grid.page == $grid.firstPage">&laquo;</span>
    </li>

    <li ng-class="{'disabled': page == $grid.page }" ng-repeat="page in $grid.pages">
        <a ng-click="$grid.setPage(page)" ng-href="">
            {{ page }}
        </a>
    </li>

    <li ng-class="{'disabled': $grid.page == $grid.lastPage }" ng-if="$grid.nextPage">
        <a ng-if="$grid.page != $grid.lastPage" ng-click="$grid.setPage($grid.nextPage)" ng-href="">
            &raquo;
         </a>
        <span ng-if="$grid.page == $grid.lastPage">&raquo;</span>
    </li>
    <li ng-class="{'disabled': $grid.page == $grid.lastPage }" ng-if="$grid.lastPage">
         <a ng-if="$grid.page != $grid.lastPage" ng-click="$grid.setPage($grid.lastPage)" ng-href="">
            &raquo;  &raquo;
         </a>
        <span ng-if="$grid.page == $grid.lastPage">&raquo;  &raquo;</span>
    </li>
</ul>
```

That's it! Cool huh?

For any questions or if you just want to come in contact,
feel free to mail us at support@middleout.com