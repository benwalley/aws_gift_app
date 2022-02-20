import React, {useEffect, useState} from 'react';
import GroupMultiSelect from "../groupMultiSelect";

export default function GroupMultiSelectPopup(props) {
    const {selectedGroups, setSelectedGroups, initialSelected, userId, isOpen, setIsOpen, onSubmit} = props

    return (<>{isOpen && <div className="multiSelectPopupContainer">
            <div className="background" onClick={(e) => {
                onSubmit(e)
                setIsOpen(false)
            }}></div>
            <div className="content">
                <form onSubmit={onSubmit}>
                    <GroupMultiSelect selectedGroups={selectedGroups} setSelectedGroups={setSelectedGroups} userId={userId} initialSelected={initialSelected}/>
                    <button className="themeButton">Update</button>
                </form>
            </div>

        </div>}
    </>
    );
}

