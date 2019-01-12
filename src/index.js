import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import ApptSched from './components/ApptSched';


let startDate = moment();
if (startDate.hour() > 19) {
    startDate = moment().add(1, 'days');
}
console.log(startDate.toDate());


ReactDOM.render(
    <ApptSched date={startDate} baseURL="//localhost:3001" />,
    document.getElementById('root'),
);