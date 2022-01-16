import React, {useEffect, useState} from 'react';


export default function IconButton(props) {
    const {displayName, icon, onClick, type, confirm, confirmText} = props
    const [confirmationOpen, setConfirmationOpen] = useState(false)


    const getClassName = () => {
        if(!type || type==="primary") {
            return "iconButton"
        } else if (type==="secondary") {
            return "iconButtonSecondary"
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
        setConfirmationOpen(false)
        onClick()
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

    const getIcon = () => {
        if(!icon) {
            return displayName;
        }

        return icon;
    }

    return (
        <>
            <button onClick={onButtonClick} className={getClassName()} aria-label={displayName}>
                {getIcon()}
            </button>
            {confirm && confirmationOpen && getConfirmation()}
        </>

);
}
