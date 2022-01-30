import React, {useEffect, useState} from 'react';
import './loading.scss'

export default function Loading() {
    return (
        <div className="loadingContainer">

            <div className="gift-box-container">
                <div className="gift-box">
                    <div className="gift-box__side gift-box__side--front"></div>
                    <div className="gift-box__side gift-box__side--back"></div>
                    <div className="gift-box__side gift-box__side--left"></div>
                    <div className="gift-box__side gift-box__side--right"></div>
                    <div className="gift-box__end gift-box__side--top"></div>
                    <div className="gift-box__end gift-box__side--bottom"></div>
                    <div className="gift-box-lid__side gift-box-lid__side--front"></div>
                    <div className="gift-box-lid__side gift-box-lid__side--back"></div>
                    <div className="gift-box-lid__side gift-box-lid__side--left"></div>
                    <div className="gift-box-lid__side gift-box-lid__side--right"></div>
                    <div className="gift-box-lid__end gift-box-lid__side--top"></div>
                </div>
                <h2 className="loadingText">
                    <span>Loading</span>
                    <span className="span1">.</span>
                    <span className="span2">.</span>
                    <span className="span3">.</span>
                </h2>
            </div>
        </div>
    );
}

