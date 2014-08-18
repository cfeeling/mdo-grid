// Type definitions for MdoGrid (mdo.grid module)
// Project: https://github.com/middleout/mdo-grid
// Definitions by: Michel Salib <michelsalib@hotmail.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module mdo.grid {

    interface IGridConfig {
        reload();
        setSorting(sorting: any);
        getSorting(): any;
        setSortingKeywords(sortAsc: string, sortDesc: string, defaultSortDir: string);
        getSortingKeywords(): ISortingKeywords;
        setFilters(filters: any);
        getFilters() : any;
        setNbOfItemsPerPage(itemsPerPage: number);
        getNbOfItemsPerPage(): number;
        getData(defered: ng.IDeferred<any>, urlParams: string, mdoGrid: IGridService);
    }

    interface IGridService {
        sorting: any;
        sortingKeywords: ISortingKeywords;
        filters: any;
        data: any[];
        total: number;
        count: number;
        page: number;
        pages: number[];
        firstPage: number;
        lastPage: number;
        previousPage: number;
        nextPage: number;
        isLoading: boolean;
        sortBy(sortField: string);
        isSortBy(sortField: string, sortDir: string): boolean;
        setItems(data: any);
        setTotalItemsCount(totalItemsCount: number);
        toUrl(sortingParams: any, filtersParams: any, currentPage: number, itemsPerPage: number);
        loadData();
        setPage(pageNb: number);
    }

    interface ISortingKeywords {
        sortAsc: string;
        sortDesc: string;
        defaultSortDir: string;

    }
}
