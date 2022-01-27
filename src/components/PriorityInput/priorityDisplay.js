import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGrin, faGrinHearts, faMeh} from "@fortawesome/free-solid-svg-icons";


export default function PriorityDisplay(props) {
    const {priority, showName, showNumbers, showVisual} = props

    return (
        <div className="priorityDisplay">
            {priority && <div className="priorityDisplayContent">
                {showName && <div className="nameSection">
                    Priority
                </div>}
                {showNumbers && <div className="numberVersion">
                    <strong>{priority}</strong>/10
                </div>}
                {showVisual && <div className="visualVersion">
                    <div className="smileyLeft">
                        <FontAwesomeIcon icon={faMeh} size="1x" />
                    </div>
                    <div className={priority > 4 ? "numberHappy" : "numberSad"}>{`${priority}/10`}</div>
                    <div className="smileyRight">
                        <FontAwesomeIcon icon={faGrinHearts} size="1x" />
                    </div>
                    <div className="progressBar">
                        <div className={`a${priority}`}></div>
                    </div>
                </div>}
            </div>}

        </div>
    );
}

