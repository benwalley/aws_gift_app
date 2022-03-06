import React, {useEffect, useState} from 'react';
import {useRecoilValueLoadable, useSetRecoilState} from "recoil";
import dbUserAllItems from "../../../../recoil/selectors/dbUserAllItems";
import './addItemsToGroup.scss'
import {Groups, WishlistItems} from "../../../../models";
import {DataStore} from "@aws-amplify/datastore";

export default function AddItemsToGroup(props) {
    const {newGroupId, close} = props;
    const itemsUpdate = useRecoilValueLoadable(dbUserAllItems)
    const [items, setItems] = useState()
    const [checkedItems, setCheckedItems] = useState([])

    useEffect(() => {
        if(itemsUpdate.state === "hasValue") {
            setItems(itemsUpdate.contents);
        }
    }, [itemsUpdate]);

    const handleToggleValue = (id) => {
        const checkedCopy = [...checkedItems];
        const isChecked = !isIdSelected(id)
        if(isChecked) {
            checkedCopy.push(id);
        } else {
            const index = checkedCopy.indexOf(id);
            checkedCopy.splice(index, 1);
        }

        setCheckedItems([...new Set(checkedCopy)])
    }

    const isIdSelected = (id) => {
        return checkedItems.indexOf(id) > -1;
    }

    const renderItemList = () => {
        if(!items) return;
        return items.map((item) => {
            return <div className={isIdSelected(item.id) ? "selected" : ''} onClick={() => handleToggleValue(item.id)}>{item.name}</div>
        })
    }

    const handleAddItemsToGroup = async (e) => {
        e.preventDefault();

        for(const id of checkedItems) {
            const original = await DataStore.query(WishlistItems, id);
            await DataStore.save(Groups.copyOf(original, updated => {
                try {
                    const groupsCopy = [...original.groupIds]
                    groupsCopy.push(newGroupId)
                    updated.groupIds = [...new Set(groupsCopy)]
                } catch (e) {
                    console.log(e)
                }
            }))
        }
        close();
    }

    return (
        <div className="addItemsToGroupContainer">
            {items && items.length > 0 ? <form onSubmit={handleAddItemsToGroup} className="themeList">
                <h3>Select existing items you want to add to this group</h3>
                {renderItemList()}
                <button className="themeButton">Save</button>
            </form>: <div>
                <h3>Select existing items you want to add to this group</h3>
                <div>You have no items created yet.</div>
            </div>}
        </div>
    );
}

