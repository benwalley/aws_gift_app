import React, {useEffect, useState} from 'react';
import './priorityInput.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faMeh, faGrinHearts, faGrin} from '@fortawesome/free-solid-svg-icons'

export default function PriorityInput(props) {
    const {priority, setPriority} = props;

    const handleClick = (value) => {
        setPriority(value)
    }

    return (
        <div className="priorityContainer">
            <label htmlFor="">Set a priority to tell how much you want this.</label>
            <div className="sliderScale">
                <div onClick={() => handleClick(1)} className={priority >= 1 ? "buttonSelected" : "button"}>
                    <FontAwesomeIcon icon={faMeh} size="lg" />
                </div>
                <div onClick={() => handleClick(2)} className={priority >= 2 ? "buttonSelected" : "button"}>
                    2
                </div>
                <div onClick={() => handleClick(3)} className={priority >= 3 ? "buttonSelected" : "button"}>
                    3
                </div>
                <div onClick={() => handleClick(4)} className={priority >= 4 ? "buttonSelected" : "button"}>
                    4
                </div>
                <div onClick={() => handleClick(5)} className={priority >= 5 ? "buttonSelected" : "button"}>
                    <FontAwesomeIcon icon={faGrin} size="lg" />
                </div>
                <div onClick={() => handleClick(6)} className={priority >= 6 ? "buttonSelected" : "button"}>
                    6
                </div>
                <div onClick={() => handleClick(7)} className={priority >= 7 ? "buttonSelected" : "button"}>
                    7
                </div>
                <div onClick={() => handleClick(8)} className={priority >= 8 ? "buttonSelected" : "button"}>
                    8
                </div>
                <div onClick={() => handleClick(9)} className={priority >= 9 ? "buttonSelected" : "button"}>
                    9
                </div>
                <div onClick={() => handleClick(10)} className={priority >= 10 ? "buttonSelected" : "button"}>
                    <FontAwesomeIcon icon={faGrinHearts} size="lg" />
                </div>

            </div>
        </div>
    );
}

