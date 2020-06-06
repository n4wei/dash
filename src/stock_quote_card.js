import React from 'react';
import Card from 'react-bootstrap/Card';

function StockQuoteCard(props) {
    return (
        <Card className='text-center' style={{ width: '10rem' }}>
            <Card.Header>
                <Card.Text><b>{props.data.symbol}</b></Card.Text>
                <Card.Text><b>{props.data.current}</b>{' @'+props.data.time}</Card.Text>
            </Card.Header>
            <Card.Body>
                <Card.Text>{'open '+props.data.open}</Card.Text>
                <Card.Text>{props.data.low+' - '+props.data.high}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default StockQuoteCard;