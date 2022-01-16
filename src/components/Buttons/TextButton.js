import React, {useEffect, useState} from 'react';
import './buttons.scss'

export default function TextButton(props) {
    const {displayName, onClick, type, confirm, confirmText} = props
    const [confirmationOpen, setConfirmationOpen] = useState(false)


    const getClassName = () => {
        if(!type || type==="primary") {
            return "textButton"
        } else if (type==="secondary") {
            return "textButtonSecondary"
        }
    }

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
                    <button onClick={handleClickNo} className="textButton">Cancel</button>
                    <button onClick={handleClickYes} className="textButton">Yes</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <button onClick={onButtonClick} className={getClassName()}>
                {displayName}
            </button>
            {confirm && confirmationOpen && getConfirmation()}
        </>
);
}

