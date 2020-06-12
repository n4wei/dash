import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Clock from './clock.js';
import Util from './util.js';

function TimeDate() {
    return (
        <>
            <Row><Col><h1><Clock/></h1></Col></Row>
            <Row><Col><h2>{Util.formatDate(new Date())}</h2></Col></Row>
        </>
    );
};

export default TimeDate;