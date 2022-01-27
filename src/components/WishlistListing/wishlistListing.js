import React, {useEffect, useState} from 'react';
import { DataStore, Predicates, SortDirection, syncExpression } from 'aws-amplify'
import {Wishlist, WishlistItems} from "../../models";
import {API} from "@aws-amplify/api/lib";
import * as queries from "../../graphql/queries";
import WishlistItem from "../WishlistItem/wishlistItem";
import './wishlistListing.scss'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useNavigate
} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {dbUserState, visibleWishlistItemsState} from "../../recoil/selectors";
import {visibleWishlistIDState} from "../../recoil/atoms";


export default function WishlistListing(props) {
    const {} = props;
    const [filteredList, setFilteredList] = useState();
    const [selectedFilterBy, setSelectedFilterBy] = useState('name (search)')
    const [nameSearch, setNameSearch] = useState('')
    const navigate = useNavigate()
    let { wishlistId, itemId } = useParams();
    const dbUser = useRecoilValue(dbUserState)
    const wishlistItems = useRecoilValue(visibleWishlistItemsState)
    const [visibleWishlistId, setVisibleWishlistId] = useRecoilState(visibleWishlistIDState)

    useEffect(() => {
        setWishlistIdIfNecessary()
        handleFilterChange()
    }, [wishlistItems, selectedFilterBy, nameSearch])

    useEffect(() => {
        setWishlistIdIfNecessary()
    }, [])

    const setWishlistIdIfNecessary = () => {
        if(!visibleWishlistId) {
            if(wishlistId) {
                setVisibleWishlistId(wishlistId)
            }
        }
    }

    const handleFilterChange = () => {
        if(!wishlistItems) return;
        if(!selectedFilterBy) return;
        const listCopy = [...wishlistItems];
        const sortedList = listCopy.sort((a, b) => filterBy[selectedFilterBy].fun(a, b))
        setFilteredList([...sortedList])
    }

    const getFilterOptions = () => {
        const returnArray = []
        for(const option in filterBy) {
            returnArray.push(<option key={option} value={option}>{option}</option>)
        }
        return returnArray
    }

    const filterBy = {
        'name (search)': {
            name: 'name (search)',
            fun: (a, b) => {
                const aHasIt = a.name.toLowerCase().indexOf(nameSearch.toLowerCase()) > -1;
                const bHasIt = b.name.toLowerCase().indexOf(nameSearch.toLowerCase()) > -1;
                if(!aHasIt && !bHasIt) {
                    return 0;
                }
                if(aHasIt && !bHasIt) return -1
                if(bHasIt && !aHasIt) return 11
                return 0; // if both have it
            }
        },
        'price (low to high)' : {
            name: 'price (low to high)',
            fun: (a, b) => {
                if(!a.price && !b.price) {
                    return 0;
                }
                if(!a.price) {
                    return 1;
                }
                if(!b.price) {
                    return -1;
                }
                return a.price - b.price
            }
        },
        'price (high to low)' : {
            name: 'price (high to low)',
            fun: (a, b) => {
                if(!a.price && !b.price) {
                    return 0;
                }
                if(!a.price) {
                    return 1;
                }
                if(!b.price) {
                    return -1;
                }
                return b.price - a.price
            }
        },
        'priority (high first)' : {
            name: 'priority (high first)',
            fun: (a, b) => {
                if(!a.priority && !b.priority) return 0
                if(!a.priority) return 1
                if(!b.priority) return -1
                return b.priority - a.priority
            }
        },
        'not gotten' : {
            name: 'not gotten',
            fun: (a, b) => {
                if(b.gottenBy.length > 0) return -1
                if(a.gottenBy.length > 0) return 1
                return 0;
            }

        },
        'someone wants to go in on it' : {
            name: 'someone wants to go in on it',
            fun: (a, b) => {
                if(b.wantsToGet.length > 0) return 1
                if(a.wantsToGet.length > 0) return -1
                return 0;
            }
        }
    }

    const getListItems = () => {
        if(!wishlistItems) return
        return ((filteredList || wishlistItems).map((item, index) => {
            return <WishlistItem
                data={item}
                key={item.id}
                count={index}
            />
        }))
    }

    return (
        <div className="wishlistListingContainer">
            <div className="filtering">
                <h4>Filter by:</h4>
                <select className="themeSelect" name="filterBy" id="filterBy" onChange={(e) => setSelectedFilterBy(e.target.value)}>
                    {getFilterOptions()}
                </select>
                {selectedFilterBy === "name (search)" && <div className="nameSearchContainer">
                    <input
                        className="nameSearch"
                        type="text"
                        placeholder="search by name" value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}/>
                </div>}
            </div>
            <div className="listItems">
                {getListItems()}
            </div>
        </div>
    );

}

