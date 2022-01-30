import React from 'react';
import './modal.scss'

export default function Modal(props) {
    const {close, isOpen} = props

    return (<>
            {isOpen && <div className="modalContainer" >
                <div className="modalBackground" onClick={close}></div>
                <div className="modalContent">
                    {props.children}
                </div>
            </div>}
    </>

    );
}

