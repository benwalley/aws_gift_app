import React, {useEffect, useState} from 'react';
import './buttons.scss'

export default function ButtonAsText(props) {
    const {displayName, onClick, type, confirm, confirmText} = props
    const [confirmationOpen, setConfirmationOpen] = useState(false)

    const onButtonClick = (e) => {
        if(onClick) {
            if(confirm) {
                setConfirmationOpen(true)
            } else {
                onClick(e);
            }
        } else {
            e.preventDefault();
        }
    }

    const handleClickNo = (e) => {
        e.preventDefault();
        setConfirmationOpen(false)
    }

    const handleClickYes = (e) => {
        e.preventDefault();
        onClick()
        setConfirmationOpen(false)
    }

    const getConfirmation = () => {
        return (
            <div className="buttonConfirmation">
                <h3>{confirmText}</h3>
                <div className="buttonConfirmationButtons">
                    <button className="textButton" onClick={handleClickNo} >Cancel</button>
                    <button onClick={handleClickYes} className="textButton">Yes</button>
                </div>

            </div>
        )
    }

    return (
        <>
            <button onClick={onButtonClick} className={'buttonAsText'}>
                {displayName}
            </button>
            {confirm && confirmationOpen && getConfirmation()}
        </>

    );
}

