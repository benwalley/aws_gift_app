import React, {useEffect, useState} from 'react';


export default function IconButton(props) {
    const {displayName, icon, onClick, type} = props

    const getClassName = () => {
        if(!type || type==="primary") {
            return "iconButton"
        } else if (type==="secondary") {
            return "iconButtonSecondary"
        }
    }

    const onButtonClick = (e) => {
        if(onClick) {
            onClick(e);
        } else {
            e.preventDefault();
        }
    }

    const getIcon = () => {
        if(!icon) {
            return displayName;
        }

        return icon;
    }

    return (
        <button onClick={onButtonClick} className={getClassName()} aria-label={displayName}>
            {getIcon()}
        </button>
    );
}
