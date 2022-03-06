import React, {useEffect, useState} from 'react';
import './moneyRecordsList.scss'
import formatPrice from "../../helpers/formatPrice";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import IconButton from "../Buttons/IconButton";
import {DataStore} from "@aws-amplify/datastore";
import {Money} from "../../models";
import userMoniesState from "../../recoil/selectors/userMonies";
import {useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {refreshMonies} from "../../recoil/selectors";
import MoneyRecordItem from "./MoneyRecordItem/moneyRecordItem";
export default function MoneyRecordsList(props) {
    const {} = props
    const [people, setPeople] = useState([])
    const [personOne, setPersonOne] = useState('')
    const [personTwo, setPersonTwo] = useState('')
    const [totalPersonOneOwes, setTotalPersonOneOwes] = useState(0)
    const [totalPersonTwoOwes, setTotalPersonTwoOwes] = useState(0)
    const [subtotal, setSubtotal] = useState('')
    const moneyRecordsUpdate = useRecoilValueLoadable(userMoniesState)
    const refreshMoney = useSetRecoilState(refreshMonies)
    // State values
    const [moneyRecords, setMoneyRecords] = useState([])

    useEffect(() => {
        if(moneyRecordsUpdate.state === "hasValue") {
            setMoneyRecords(moneyRecordsUpdate.contents);
        }
    }, [moneyRecordsUpdate]);


    useEffect(() => {
        updateRecordPeopleList()
    }, [moneyRecords])

    useEffect(() => {
        updateFilteredData()
    }, [personOne, personTwo, moneyRecords])

    const handleDeleteItem = async (e, record) => {
        e.preventDefault();
        const id = record.id
        const todelete = await DataStore.query(Money, id);
        await DataStore.delete(todelete);
        refreshMoney()
    }

    const getList = () => {
        return getFilteredList().map((record, index) => {
            return <MoneyRecordItem key={index} record={record} index={index} handleDeleteItem={handleDeleteItem}/>
        })
    }

    const getPersonOneSelect = () => {
        const filteredPeople = people.filter(person => person !== personTwo && person !== "")
        return (
            <select className="themeSelect" name="people" value={personOne} onChange={(e) => setPersonOne(e.target.value)}>
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
            <select className="themeSelect" name="people" value={personTwo} onChange={(e) => setPersonTwo(e.target.value)}>
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
            for(const record of moneyRecords) {
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
        for(const record of moneyRecords) {
            peopleArray.push(record.moneyFromName)
            peopleArray.push(record.moneyToName)
        }
        const filteredPeople = new Set([...peopleArray])
        setPeople([...filteredPeople])
    }

    const getFilteredList = () => {
        if(!personOne && !personTwo) return moneyRecords;
        if(personOne && personTwo) {
            return moneyRecords.filter(record => {
                const from = record.moneyFromName
                const to = record.moneyToName
                if((from === personOne && to === personTwo) || (from === personTwo && to === personOne)) {
                    return record;
                }
            })
        }
        return moneyRecords.filter(record => {
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

