import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Clock from './clock.js';
import Day from './day.js';

function TimeDay() {
    return (
        <>
            <Row><Col><h1><Clock/></h1></Col></Row>
            <Row><Col><h2><Day/></h2></Col></Row>
        </>
    );
};

export default TimeDay;