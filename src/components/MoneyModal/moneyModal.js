import React, {useEffect, useState} from 'react';
import formatPrice from "../../helpers/formatPrice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'
import './moneyModal.scss'
import TextButton from "../Buttons/TextButton";
import {DataStore} from "aws-amplify";
import {WishlistItems, Money, Wishlist} from "../../models";
import MoneyRecordsList from "../MoneyRecordsList/moneyRecordsList";

export default function MoneyModal(props) {
    const {user, addError} = props;
    const [moneyRecords, setMoneyRecords] = useState([])
    const [amountOwedFrom, setAmountOwedFrom] = useState('')
    const [amountOwedTo, setAmountOwedTo] = useState('')
    const [amountOwed, setAmountOwed] = useState(0)
    const [comment, setComment] = useState('')

    useEffect(() => {
        updateMoniesList()
    }, [user])

    const updateMoniesList = async () => {
        const records = await DataStore.query(Money, c => c.creatorId("eq", user.id));
        setMoneyRecords(records)
    }

    const handleFromInputNameChange = (e) => {
        const value = e.target.value;
        setAmountOwedFrom(e.target.value)
    }

    const handleToInputNameChange = (e) => {
        const value = e.target.value;
        setAmountOwedTo(e.target.value)
    }

    const getCreatorName = () => {
        if(user && user.displayName) {
            return user.displayName;
        } else
        return false
    }

    const submitMoneyItem = async (e) => {
        e.preventDefault();
        const creatorName = getCreatorName();
        if(!creatorName || amountOwedTo === "" || amountOwedFrom === "") {
            addError("You must add a name for the person who owes, and the person who is owed.")
            return;
        }
        const itemData = {
            "creatorName": getCreatorName(),
            "creatorId": user.id,
            "moneyFromName": amountOwedFrom,
            "moneyToName": amountOwedTo,
            "amount": parseFloat(amountOwed),
            "comment": comment,
            "paid": false
        }
        const response = await DataStore.save(
            new Money(itemData)
        );
        await updateMoniesList()
        setAmountOwedFrom('')
        setAmountOwedTo('')
        setAmountOwed(0)
        setComment('')
    }

    return (
        <div className="moneyModalContents">
            <h2>Manage money owed</h2>
            <p>Keep track of money that you owe, or someone owes you.
                No payments can be made here, it is simply for helping keeping notes.</p>
            <MoneyRecordsList records={moneyRecords} updateMoneyList={updateMoniesList}/>
            <form onSubmit={submitMoneyItem}>
                <h2>Add new amount owed</h2>
                <div className="amountOwedInputContainer">
                    <div className="amountOwedFrom">
                        <label htmlFor="">Owed From</label>
                        <input value={amountOwedFrom} onChange={handleFromInputNameChange} type="text"/>
                    </div>
                    <div className="arrow">
                        <FontAwesomeIcon icon={faArrowRight} size="lg" />
                    </div>
                    <div className="amountOwedTo">
                        <label htmlFor="">Owed To</label>
                        <input value={amountOwedTo} onChange={handleToInputNameChange} type="text"/>
                    </div>
                    <div className="amountOwed">
                        <label htmlFor="">Amount</label>
                        <input value={amountOwed} onChange={(e) => setAmountOwed(e.target.value)} type="number"/>
                    </div>
                    <div className="comment">
                        <label htmlFor="">Comment</label>
                        <input className="commentInput" value={comment} onChange={(e) => setComment(e.target.value)} type="text"/>
                    </div>
                </div>

                <div className="amountOwedRendered">
                    {amountOwedFrom} owes {amountOwedTo} {formatPrice(amountOwed)}
                </div>
                <div className="submitMonies">
                    <TextButton displayName={"Add"} onClick={submitMoneyItem}/>
                </div>
            </form>
        </div>
    );
}

