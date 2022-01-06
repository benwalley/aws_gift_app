import React, {useEffect, useState} from 'react';
import './buttons.scss'

export default function TextButton(props) {
    const {displayName, onClick, type} = props

    const getClassName = () => {
        if(!type || type==="primary") {
            return "textButton"
        } else if (type==="secondary") {
            return "textButtonSecondary"
        }
    }

    const onButtonClick = (e) => {
        if(onClick) {
            onClick(e);
        } else {
           e.preventDefault();
        }
    }

    return (
        <button onClick={onButtonClick} className={getClassName()}>
            {displayName}
        </button>
    );
}

