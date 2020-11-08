import {InMemoryCache, makeVar} from "@apollo/client";

export type SortType = "rating" | "original_title" | "runtime" | "release_date" | "none";
export type SortDirectionType = "ASC" | "DESC";

export interface Interval {
    start: number;
    end: number;
}

export interface FilterType {
    genres: string[];
    productionCountries: string[];
    releaseDateInterval: Interval;
    runtimeInterval: Interval;
}

export const searchOpenVar = makeVar<boolean>(false);
export const searchVar = makeVar<string>("");

export const sortOpenVar = makeVar<boolean>(false);
export const sortVar = makeVar<SortType>("rating");
export const sortDirectionVar = makeVar<SortDirectionType>("DESC");

export const filterOpenVar = makeVar<boolean>(false);
export const filterVar = makeVar<FilterType | null>(null);
export const filterTempVar = makeVar<FilterType | null>(null);

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                searchOpen: {
                    read() {
                        return searchOpenVar();
                    }
                },
                search: {
                    read() {
                        return searchVar();
                    }
                },
                sortOpen: {
                    read() {
                        return sortOpenVar();
                    }
                },
                sort: {
                    read() {
                        return sortVar();
                    }
                },
                sortDirection: {
                    read() {
                        return sortDirectionVar();
                    }
                },
                filterOpen: {
                    read() {
                        return filterOpenVar();
                    }
                },
                filter: {
                    read() {
                        return filterVar();
                    }
                }
            }
        }
    }
});
