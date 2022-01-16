import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './modal.scss'

export default function Modal(props) {
    const {close, isOpen} = props

    return (<>
            {isOpen && <div className="modalContainer" >
                <div className="modalBackground" onClick={close}></div>
                <div className="modalContent">
                    <div className="addListItemScrollingContainer">
                        {props.children}
                    </div>
                </div>
            </div>}
    </>

    );
}

