/*
 *  Local state management. Declaration of fields and type definitions.
 */

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

// Decalartion of reactive variables
// Can be accessed directly and changed in every component that imports them

export const searchOpenVar = makeVar<boolean>(false);
export const searchVar = makeVar<string>("");

export const sortOpenVar = makeVar<boolean>(false);
export const sortVar = makeVar<SortType>("rating");
export const sortDirectionVar = makeVar<SortDirectionType>("DESC");

export const filterOpenVar = makeVar<boolean>(false);

// Temporary filter values; used while filter menu is open,
// set as real filter values when filter menu is closed
export const filterTempVar = makeVar<FilterType | null>(null);

// Real filter values; used by movie container
export const filterVar = makeVar<FilterType | null>(null);

export const popupOpenVar = makeVar<boolean>(false);
export const popupMovieVar = makeVar<string>("");

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            // Define the fields in the store and how to read them
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
                },
                popupOpen: {
                    read() {
                        return popupOpenVar();
                    }
                },
                popupMovieVar: {
                    read() {
                        return popupMovieVar();
                    }
                }
            }
        }
    }
});
