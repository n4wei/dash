import React from 'react';
import Card from 'react-bootstrap/Card';

function StockQuoteCard(props) {
    return (
        <Card className='text-center dash-stock-quote-card'>
            <Card.Body>
                <Card.Title><b>{props.data.symbol}</b></Card.Title>
                <Card.Text><b>{props.data.current}</b>{' @'+props.data.time}</Card.Text>
                <Card.Text>{props.data.low+'-'+props.data.high}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default StockQuoteCard;