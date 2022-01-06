import React, {useEffect, useState} from 'react';
import './buttons.scss'

export default function ButtonAsText(props) {
    const {displayName, onClick, type} = props

    const onButtonClick = (e) => {
        if(onClick) {
            onClick(e);
        } else {
            e.preventDefault();
        }
    }

    return (
        <button onClick={onButtonClick} className={'buttonAsText'}>
            {displayName}
        </button>
    );
}

