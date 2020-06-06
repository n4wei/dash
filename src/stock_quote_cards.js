import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';

import StockQuoteCard from './stock_quote_card.js';
import Util from './util.js';
import Secrets from './config/secrets.json';

const stocks = [
    {symbol: 'BOX', decimals: 2},
    {symbol: 'GILD', decimals: 2},
    {symbol: '^GSPC', decimals: 0},
];

class StockQuoteCards extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stockQuotes: [],
        };

        this.refreshStockQuotes();
    };

    async getStockQuoteDataFromAPI(symbol) {
        const response = await fetch('https://finnhub.io/api/v1/quote?symbol='+symbol+'&token='+Secrets.finnhub_token, {
            'method': 'GET',
        })
        .catch(err => console.error(err));
        return response.json();
    };

    refreshStockQuotes() {
        let stockQuotes = [];

        stocks.forEach((stock) => {
            this.getStockQuoteDataFromAPI(stock.symbol).then((data) => {
                console.log('new', data);
                stockQuotes.push({
                    symbol: stock.symbol === '^GSPC' ? 'SP500' : stock.symbol,
                    current: Util.roundDecimals(data.c, stock.decimals),
                    time: Util.formatTime(data.t*1000),
                    open: Util.roundDecimals(data.o, stock.decimals),
                    low: Util.roundDecimals(data.l, stock.decimals),
                    high: Util.roundDecimals(data.h, stock.decimals),
                });

                if (stockQuotes.length === stocks.length) {
                    this.setState({
                        stockQuotes: stockQuotes,
                    });
                }
            });
        });
    };

    render() {
        let stockQuoteCards;
        if (this.state.stockQuotes.length > 0) {
            stockQuoteCards = this.state.stockQuotes.slice().map((stockQuoteData, i) => {
                return <StockQuoteCard key={i} data={stockQuoteData}></StockQuoteCard>;
            });
        }

        return (
            <>
                <Row>
                    <Col><h2>Stock Quotes</h2></Col>
                    <Col><Button variant='primary' onClick={()=>this.refreshStockQuotes()}><i className='wi wi-refresh'/></Button></Col>
                </Row>
                <Row><CardDeck>{stockQuoteCards}</CardDeck></Row>
            </>
        );
    };
};

export default StockQuoteCards;