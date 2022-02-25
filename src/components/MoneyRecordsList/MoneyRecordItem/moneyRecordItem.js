import React, {useEffect, useState} from 'react';
import formatPrice from "../../../helpers/formatPrice";
import IconButton from "../../Buttons/IconButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faTimesCircle} from "@fortawesome/free-solid-svg-icons";


export default function MoneyRecordItem(props) {
    const [isOpen, setIsOpen] = useState(false)
    const {record, index, handleDeleteItem} = props;

    return (
        <div className={index%2===0 ? "moneyRecordRowEven" : "moneyRecordRowOdd"}>
            <div className="commentToggle" >
                {record.comment && <IconButton displayName={"Delete row"} onClick={(e) => setIsOpen(!isOpen) } icon={<FontAwesomeIcon icon={faComment} size="lg" />}/>}
            </div>
            <div className="recordFromName" >{record.moneyFromName}</div>
            <div className="recordToName" >{record.moneyToName}</div>
            <div className="recordAmount" >{formatPrice(record.amount)}</div>
            <div className="deleteRow">
                <IconButton displayName={"Delete row"} onClick={(e) => handleDeleteItem(e, record) } icon={<FontAwesomeIcon icon={faTimesCircle} size="lg" />}/>
            </div>
            {record.comment && isOpen && <div className="comment"><span>Comment: </span>{record.comment}</div>}
        </div>
    );
}

