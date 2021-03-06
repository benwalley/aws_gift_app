import React, {useEffect, useState} from 'react';
import './groupSelect.scss'
import {usersGroupsState} from "../../recoil/selectors";
import {useRecoilState, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {currentGroupIdState} from "../../recoil/atoms";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function GroupSelect(props) {
    const {setGlobalGroup, selected} = props
    const groupsUpdate = useRecoilValueLoadable(usersGroupsState)
    const [groups, setGroups] = useState([])
    const [currentGroupId, setCurrentGroupId] = useRecoilState(currentGroupIdState)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    useEffect(() => {
        if(groupsUpdate.state === "hasValue") {
            setGroups(groupsUpdate.contents);
        }
    }, [groupsUpdate]);


    const handleSelectOption = (groupData) => {
        setCurrentGroupId(groupData.id);
        localStorage.setItem('wishlistGroup', groupData.id);
        setDropdownOpen(false)
    }

    const getNameFromId = (id) => {
        if(!groups) return 'loading...'
        for(const group of groups) {
            if(group.id === id) {
                return <span key={group.id}>{group.groupName}</span>
            }
        }
    }

    const renderGroupOption = (groupData) => {
        return <div key={groupData.id} className={groupData.id === currentGroupId ? "groupItemDisabled" : "groupItem"} onClick={(e) => handleSelectOption(groupData)}>{groupData.groupName}</div>
    }


    return (<>
            {groups && groups.length > 0 && <div className="groupSelect">
                <div className="trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <div>{getNameFromId(currentGroupId)}</div>
                    <FontAwesomeIcon icon={faChevronDown} size="md"/>
                </div>
                {dropdownOpen && <div className="dropdownContent">
                    {groups.map(groupData => renderGroupOption(groupData))}
                </div>}
                {dropdownOpen && <div className="dropdownBackground" onClick={() => setDropdownOpen(false)}></div>}
            </div>}
        </>
    );
}

