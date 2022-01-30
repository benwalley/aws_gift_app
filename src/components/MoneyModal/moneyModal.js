import React, {useEffect, useState} from 'react';
import formatPrice from "../../helpers/formatPrice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight} from '@fortawesome/free-solid-svg-icons'
import './moneyModal.scss'
import TextButton from "../Buttons/TextButton";
import {DataStore} from "aws-amplify";
import {WishlistItems, Money, Wishlist} from "../../models";
import MoneyRecordsList from "../MoneyRecordsList/moneyRecordsList";

import {dbUserState, refreshMonies} from "../../recoil/selectors";
import {useRecoilValueLoadable, useSetRecoilState} from "recoil";

export default function MoneyModal(props) {
    const {} = props;
    const [amountOwedFrom, setAmountOwedFrom] = useState('')
    const [amountOwedTo, setAmountOwedTo] = useState('')
    const [amountOwed, setAmountOwed] = useState(0)
    const [comment, setComment] = useState('')
    const refreshMoney = useSetRecoilState(refreshMonies)
    const dbUserUpdate = useRecoilValueLoadable(dbUserState);
    // State values
    const [dbUser, setDbUser] = useState()

    useEffect(() => {
        if(dbUserUpdate.state === "hasValue") {
            setDbUser(dbUserUpdate.contents);
        }
    }, [dbUserUpdate]);

    const handleFromInputNameChange = (e) => {
        setAmountOwedFrom(e.target.value)
    }

    const handleToInputNameChange = (e) => {
        setAmountOwedTo(e.target.value)
    }

    const getCreatorName = () => {
        if(dbUser && dbUser.displayName) {
            return dbUser.displayName;
        } else
        return false
    }

    const submitMoneyItem = async (e) => {
        e.preventDefault();
        const creatorName = getCreatorName();
        if(!creatorName || amountOwedTo === "" || amountOwedFrom === "") {
            // addError("You must add a name for the person who owes, and the person who is owed.")
            return;
        }
        const itemData = {
            "creatorName": getCreatorName(),
            "creatorId": dbUser.id,
            "moneyFromName": amountOwedFrom,
            "moneyToName": amountOwedTo,
            "amount": parseFloat(amountOwed),
            "comment": comment,
            "paid": false
        }
        const response = await DataStore.save(
            new Money(itemData)
        );
        setAmountOwedFrom('')
        setAmountOwedTo('')
        setAmountOwed(0)
        setComment('')
        refreshMoney()
    }

    return (
        <div className="moneyModalContents">
            <h2>Manage money owed</h2>
            <p>Keep track of money that you owe, or someone owes you.
                No payments can be made here, it is simply for helping keeping notes.</p>
            <MoneyRecordsList/>
            <form onSubmit={submitMoneyItem}>
                <h2>Add new amount owed</h2>
                <div className="amountOwedInputContainer">
                    <div className="amountOwedFrom">
                        <label htmlFor="">Owed From</label>
                        <input className="themeInput" value={amountOwedFrom} onChange={handleFromInputNameChange} type="text"/>
                    </div>
                    <div className="arrow">
                        <FontAwesomeIcon icon={faArrowRight} size="lg" />
                    </div>
                    <div className="amountOwedTo">
                        <label htmlFor="">Owed To</label>
                        <input className="themeInput" value={amountOwedTo} onChange={handleToInputNameChange} type="text"/>
                    </div>
                    <div className="amountOwed">
                        <label htmlFor="">Amount</label>
                        <input className="themeInput" value={amountOwed} onChange={(e) => setAmountOwed(e.target.value)} type="number"/>
                    </div>
                    <div className="comment">
                        <label htmlFor="">Comment</label>
                        <input className="themeInput" value={comment} onChange={(e) => setComment(e.target.value)} type="text"/>
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

