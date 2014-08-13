angular.module('mdo.grid', []).directive('mdoGrid', ['$q', function ($q, mdoGridConfig) {
    return {
        priority: 1,
        scope: false,
        link: function (scope, element, attributes) {

            var mdoGridConfig = scope[attributes.mdoGrid];

            var $grid = {
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

                    this.pages = [];
                    this.isLoading = true;
                    var defered = $q.defer();
                    var self = this;

                    var total = self.total;
                    var count = self.count;

                    this.getData(defered, this.toUrl(this.sorting, this.filters, this.page, this.count), this).then(function () {
                        self.isLoading = false;

                        var totalPages = Math.ceil(  self.total / self.count );

                        for (var i = 1; i <= totalPages; i ++) {
                            self.pages.push(i);
                        }
                        self.firstPage    = totalPages > 0 ? 1 : 0;
                        self.lastPage     = totalPages;
                        self.nextPage     = (self.page + 1 >= totalPages) ? totalPages : self.page + 1;
                        self.previousPage = (self.page - 1 <= 0) ? 1 : self.page - 1;
                        self.previousPage = totalPages > 0 ? self.previousPage : 0;

                        if (self.page > self.lastPage && totalPages > 0) {
                            self.page = self.lastPage;
                            self.loadData();
                        }
                    });
                },
                setPage: function(pageNb){
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
            $grid.config          = mdoGridConfig;

            mdoGridConfig.reload();
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
        }
    }
});
