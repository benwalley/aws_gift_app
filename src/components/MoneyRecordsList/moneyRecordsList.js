import React, {useEffect, useState} from 'react';
import './moneyRecordsList.scss'
import formatPrice from "../../helpers/formatPrice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import IconButton from "../Buttons/IconButton";
import {DataStore} from "@aws-amplify/datastore";
import {Money} from "../../models";

export default function MoneyRecordsList(props) {
    const {records, updateMoneyList} = props
    const [people, setPeople] = useState([])
    const [personOne, setPersonOne] = useState('')
    const [personTwo, setPersonTwo] = useState('')
    const [totalPersonOneOwes, setTotalPersonOneOwes] = useState(0)
    const [totalPersonTwoOwes, setTotalPersonTwoOwes] = useState(0)
    const [subtotal, setSubtotal] = useState('')

    useEffect(() => {
        updateRecordPeopleList()
    }, [records])

    useEffect(() => {
        updateFilteredData()
    }, [personOne, personTwo, records])

    const handleDeleteItem = async (e, record) => {
        e.preventDefault();
        const id = record.id
        const todelete = await DataStore.query(Money, id);
        await DataStore.delete(todelete);
        updateMoneyList()
    }

    const getList = () => {
        return getFilteredList().map((record, index) => {
            return (<div key={index} className={index%2===0 ? "moneyRecordRowEven" : "moneyRecordRowOdd"}>
                <div className="recordFromName" >{record.moneyFromName}</div>
                <div className="recordToName" >{record.moneyToName}</div>
                <div className="recordAmount" >{formatPrice(record.amount)}</div>
                <div className="deleteRow">
                    <IconButton displayName={"Delete row"} onClick={(e) => handleDeleteItem(e, record) } icon={<FontAwesomeIcon icon={faTimesCircle} size="lg" />}/>
                </div>
            </div>)
        })
    }

    const getPersonOneSelect = () => {
        const filteredPeople = people.filter(person => person !== personTwo && person !== "")
        return (
            <select name="people" value={personOne} onChange={(e) => setPersonOne(e.target.value)}>
                <option value="">--choose person--</option>
                {filteredPeople.map(person => {
                    return < option value={person} key={person}>{person}</option>
                })}
            </select>
        )
    }

    const getPersonTwoSelect = () => {
        const filteredPeople = people.filter(person => person !== personOne && person !== "")
        return (
            <select name="people" value={personTwo} onChange={(e) => setPersonTwo(e.target.value)}>
                <option value="">--choose person--</option>
                {filteredPeople.map(person => {
                    return <option value={person} key={person}>{person}</option>
                })}
            </select>
        )
    }

    const updateFilteredData = () => {
        if(personOne && personTwo) {
            let personOneAmountOwed = 0;
            let personTwoAmountOwed = 0;
            for(const record of records) {
                if(record.moneyFromName === personOne && record.moneyToName === personTwo) {
                    personOneAmountOwed += record.amount
                }
                if(record.moneyFromName === personTwo && record.moneyToName === personOne) {
                    personTwoAmountOwed += record.amount
                }
            }
            setTotalPersonOneOwes(personOneAmountOwed)
            setTotalPersonTwoOwes(personTwoAmountOwed)
            if(personOneAmountOwed > personTwoAmountOwed) {
                setSubtotal(<div className="totalsDataRow"><span className="personName">{personOne}</span><span> owes </span><span className="personName">{personTwo}</span> <span className="priceSpan">{formatPrice(personOneAmountOwed - personTwoAmountOwed)}</span></div>)
            } else {
                setSubtotal(<div className="totalsDataRow"><span className="personName">{personTwo}</span><span> owes </span><span className="personName">{personOne}</span> <span className="priceSpan">{formatPrice(personTwoAmountOwed - personOneAmountOwed)}</span></div>)
            }
        }
    }


    const updateRecordPeopleList = () => {
        const peopleArray = []
        for(const record of records) {
            peopleArray.push(record.moneyFromName)
            peopleArray.push(record.moneyToName)
        }
        const filteredPeople = new Set([...peopleArray])
        setPeople([...filteredPeople])
    }

    const getFilteredList = () => {
        if(!personOne && !personTwo) return records;
        if(personOne && personTwo) {
            return records.filter(record => {
                const from = record.moneyFromName
                const to = record.moneyToName
                if((from === personOne && to === personTwo) || (from === personTwo && to === personOne)) {
                    return record;
                }
            })
        }
        return records.filter(record => {
            const from = record.moneyFromName
            const to = record.moneyToName
            if(from === personOne || from === personTwo || to === personOne || to === personTwo) {
                return record;
            }
        })
    }

    return (
        <div className="moneyRecordsListContainer">
            <div className="moneyRecordsList">
                <div className="moneyRecordsDisplayList">
                    <div className="moneyRecordsFilterBar">
                        <h4 className="recordsFilterTitle">Select one or two people to show their transactions</h4>
                        <div className="recordsFilterOne">
                            {getPersonOneSelect()}
                        </div>
                        <div className="recordsFilterTwo">
                            {getPersonTwoSelect()}
                        </div>
                    </div>
                </div>
                <div className="moneyListHeader">
                    <div>Owed from</div>
                    <div>Owed to</div>
                    <div className="headerAmount">Amount</div>
                </div>
                {getList()}

            </div>
            {personOne && personTwo && <div className="moneyTotalsData">
                <div className="totalsDataRow"><span className="personName">{personOne}</span><span> owes </span><span className="personName">{personTwo}</span> <span className="priceSpan">{formatPrice(totalPersonOneOwes)}</span></div>
                <div className="totalsDataRow"><span className="personName">{personTwo}</span><span> owes </span><span className="personName">{personOne}</span> <span className="priceSpan">{formatPrice(totalPersonTwoOwes)}</span></div>
                <div className="totalHeader">Subtotal:</div>
                <div>{subtotal}</div>
            </div>}
        </div>
    );
}

