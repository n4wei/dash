import React from 'react';

import Row from 'react-bootstrap/Row';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

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
            isVisible: true,
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
        if (this.refreshButton !== undefined) {
            this.refreshButton.blur();
        }

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
                        isVisible: this.state.isVisible,
                    });
                }
            });
        });
    };

    toggleIsVisible() {
        this.titleButton.blur();
        this.setState({
            stockQuotes: this.state.stockQuotes,
            isVisible: !this.state.isVisible,
        });
    };

    render() {
        let stockQuoteCards;
        if (this.state.stockQuotes.length > 0) {
            stockQuoteCards = this.state.stockQuotes.slice().map((stockQuoteData, i) => {
                return <StockQuoteCard key={'stock-quote-'+i} data={stockQuoteData}></StockQuoteCard>;
            });
        }

        return (
            <>
                <Row>
                    <button className='text-left dash-cards-title' onClick={()=>this.toggleIsVisible()} ref={(element)=>this.titleButton=element}>
                        <h2>Stock Quotes</h2>
                    </button>
                </Row>
                <Collapse in={this.state.isVisible}>
                    <Row>
                        <CardDeck>
                            {stockQuoteCards}
                            <Card className='dash-borderless'>
                                <button className='dash-refresh-button' onClick={()=>this.refreshStockQuotes()} ref={(element)=>this.refreshButton=element}><i className='wi wi-refresh'/></button>
                            </Card>
                        </CardDeck>
                    </Row>
                </Collapse>
            </>
        );
    };
};

export default StockQuoteCards;