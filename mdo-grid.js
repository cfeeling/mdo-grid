angular.module('mdo.grid', []).directive('mdoGrid', ['$q', function ($q, mdoGridConfig) {
    return {
        priority: 1,
        scope: false,
        link: function (scope, element, attributes) {

            if (!scope[attributes.mdoGrid]) {
                var path = attributes.mdoGrid;
                path = path.split('.');

                var mdoGridConfig = scope;
                for (i = 0; i < path.length; i ++) {
                    mdoGridConfig = mdoGridConfig[path[i]];
                }
            } else {
                var mdoGridConfig = scope[attributes.mdoGrid];
            }

            var $grid = {
                hasInitialData: false,
                sorting: {},
                sortingKeywords: {
                    sortAsc : 'asc',
                    sortDesc: 'desc',
                    defaultSortDir: 'desc'
                },
                filters: {},
                data: [],
                total: 0,
                count: 0,
                page: 0,
                pages: [],
                firstPage: 0,
                lastPage: 0,
                previousPage: 0,
                nextPage: 0,
                isLoading: false,
                sortBy: function(sortField) {

                    var found = false;
                    var self = this;

                    angular.forEach(this.sorting, function(dir, field){
                        if (field == sortField) {
                            found = true;
                            self.sorting[field] = dir == self.sortingKeywords.sortAsc ? self.sortingKeywords.sortDesc : self.sortingKeywords.sortAsc;
                        }
                    });

                    if (!found) {
                        this.sorting[sortField] = this.sortingKeywords.defaultSortDir;
                    }

                    return this.loadData();

                },
                isSortBy: function(sortField, sortDir) {
                    var result = false;

                    angular.forEach(this.sorting, function(dir, field){
                        if (field == sortField && dir == sortDir) {
                            result = true;
                        }
                    });

                    return result;
                },
                setItems: function(data){
                    this.data = data;
                },
                setTotalItemsCount: function(total) {
                    this.total = total;
                },
                toUrl: function(sortingParams, filtersParams, currentPage, itemsPerPage) {
                    var params = {
                        itemsPerPage: itemsPerPage,
                        page: currentPage,
                        sorting: {},
                        filters: {}
                    };

                    angular.forEach(sortingParams, function(el, key){
                        params['sorting'][key] = el;
                    });

                    angular.forEach(filtersParams, function(el, key){
                        params['filters'][key] = el;
                    });

                    return params;
                },
                loadData: function() {

                    if (this.isLoading) {
                        return;
                    }

                    this.isLoading = true;
                    var defered = $q.defer();
                    var self = this;

                    this.getData(defered, this.toUrl(this.sorting, this.filters, this.page, this.count), this).then(function () {
                        self.isLoading = false;
                        self.setupPages();
                    });
                },
                setupPages: function() {

                    this.pages = [];

                    var totalPages = Math.ceil(  this.total / this.count );

                    for (var i = 1; i <= totalPages; i ++) {
                        this.pages.push(i);
                    }
                    this.firstPage    = totalPages > 0 ? 1 : 0;
                    this.lastPage     = totalPages;
                    this.nextPage     = (this.page + 1 >= totalPages) ? totalPages : this.page + 1;
                    this.previousPage = (this.page - 1 <= 0) ? 1 : this.page - 1;
                    this.previousPage = totalPages > 0 ? this.previousPage : 0;

                    if (this.page > this.lastPage && totalPages > 0) {
                        this.page = this.lastPage;
                        this.loadData();
                    }
                },
                setPage: function(pageNb){

                    if (this.page == pageNb) {
                        return;
                    }

                    this.page = pageNb;
                    this.loadData();
                }
            };

            $grid.getData         = mdoGridConfig.getData;
            $grid.sorting         = mdoGridConfig.sorting;
            $grid.sortingKeywords = mdoGridConfig.sortingKeywords;
            $grid.filters         = mdoGridConfig.filters;
            $grid.page            = mdoGridConfig.currentPageNumber;
            $grid.count           = mdoGridConfig.itemsPerPage;
            $grid.total           = mdoGridConfig.total;
            $grid.data            = mdoGridConfig.data;
            $grid.hasInitialData  = mdoGridConfig.hasInitialData;
            $grid.config          = mdoGridConfig;

            if ($grid.data.length > 0) {
                $grid.setupPages();
            }

            if (!$grid.hasInitialData) {
                mdoGridConfig.reload();
            }

            scope.$grid = $grid;

            scope.$watch('$grid.config.isReloading', function(value){
                if (value) {
                    $grid.config.isReloading = false;
                    $grid.loadData();
                }
            });

            scope.$watch('$grid.config.itemsPerPage', function(newValue, oldValue){
                if (newValue != oldValue) {
                    $grid.count = newValue;
                    $grid.loadData();
                }
            });
        }
    };
}]).factory('mdoGridConfig', function(){
    return {
        itemsPerPage: 10,
        currentPageNumber: 1,
        filters: [],
        sorting: [],
        sortingKeywords: {
            sortAsc : 'asc',
            sortDesc: 'desc',
            defaultSortDir: 'desc'
        },
        data: [],
        total: 0,
        isReloading: false,

        reload: function() {
            this.isReloading = true;
        },

        // methods to interact with the config here
        setSorting: function(sorting) {
            this.sorting = sorting;
        },
        setSortingKeywords: function(sortAsc, sortDesc, defaultSortDir) {
            this.sortingKeywords = {
                sortAsc : sortAsc,
                sortDesc: sortDesc,
                defaultSortDir: defaultSortDir
            };
        },
        setFilters: function(filters) {
            this.filters = filters;
        },
        setNbOfItemsPerPage: function(itemsPerPage) {

            if (itemsPerPage > 0) {
                this.itemsPerPage = itemsPerPage;
            }

        },
        getData: function(defered, urlParams) {
            // do what you want here
        },
        setInitialCount: function(count) {
            this.total = count;
            this.hasInitialData = true;
            return this;
        },
        setInitialData: function(data) {
            this.data = data;
            this.hasInitialData = true;
            return this;
        }
    }
});
