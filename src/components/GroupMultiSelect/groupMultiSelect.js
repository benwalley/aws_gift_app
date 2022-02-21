import React, {useEffect, useState} from 'react';
import './groupMultiSelect.scss'
import {usersGroupsState} from "../../recoil/selectors";
import {useRecoilState, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import IconButton from "../Buttons/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {userSpecificGroupsState} from "../../recoil/selectorFamilies";
import currentGroup from "../../recoil/selectors/currentGroup";

export default function GroupMultiSelect(props) {
    const {selectedGroups, setSelectedGroups, userId, initialSelected} = props //(change these to props when ready to use)
    const groupsUpdate = useRecoilValueLoadable(userSpecificGroupsState(userId))
    const [groups, setGroups] = useState([])
    //TODO: make all selected by default, then persist your selection
    useEffect(() => {
        if (groupsUpdate.state === "hasValue") {
            setGroups(groupsUpdate.contents);
        }
    }, [groupsUpdate]);

    useEffect(() => {
        if (initialSelected) {
            setSelectedGroups(initialSelected)
        }
    }, []);

    useEffect(() => {
        if(!groups || groups.length === 0) return;
        // Make sure that the selected groups are all available for the user that is selected.
        const selectedCopy = [...selectedGroups]
        const newGroups = selectedCopy.filter(selectedGroup => {
            // only return true if the group is in "groups"
            return groups.some(groupItem => {
                return groupItem.id === selectedGroup.id
            })
        })
        if(newGroups.length < selectedGroups.length) {
            setSelectedGroups(newGroups)
        }
    }, [selectedGroups, groups])

    const toggleSelected = (group) => {
        const selectedCopy = [...selectedGroups]
        if(selectedCopy.length === 1) {
            selectedCopy.push(group)
            setSelectedGroups([...new Set(selectedCopy)]);
            return;
        }
        const returnValue = [];
        let isAdd = true;
        for(const item of selectedCopy) {
            if(item.id === group.id) {
                isAdd = false;
            } else {
                returnValue.push(item);
            }
        }
        if(isAdd) {
            returnValue.push(group);
        }
        setSelectedGroups([...returnValue]);
    }

    const isSelected = (group) => {
        return selectedGroups.some(item => item.id === group.id)
    }


    return (<>
        {groups && groups.length > 0 && <div className="groupMultiSelect">
            {groups.map(group => {
                return <div key={group.id} onClick={(e) => toggleSelected(group)} className={isSelected(group) ? "selected" : ''}>
                        {group.groupName}
                    </div>
                })
            }
        </div>}
    </>);
}

