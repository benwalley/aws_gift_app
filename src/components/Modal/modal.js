import React from 'react';
import './modal.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

export default function Modal(props) {
    const {close, isOpen} = props

    return (<>
            {isOpen && <div className="modalContainer" >
                <div className="modalBackground" onClick={close}></div>
                <div className="modalContent">
                    <button className="closeModal" onClick={close} aria-label="close"><FontAwesomeIcon icon={faTimes} size="xl"/></button>
                    {props.children}
                </div>
            </div>}
    </>

    );
}

