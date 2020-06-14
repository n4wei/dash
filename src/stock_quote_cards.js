import React from 'react';

import Row from 'react-bootstrap/Row';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

import StockQuoteCard from './stock_quote_card.js';
import Util from './util.js';
import Secrets from './config/secrets.json';

const stocks = ['BOX','GILD','^GSPC'];

const maxPriceDigits = 5;

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
            this.getStockQuoteDataFromAPI(stock).then((newData) => {
                console.log('new', newData);

                let decimalsToRound;
                let price = String(newData.c);
                if (price.indexOf('.') === -1) {
                    decimalsToRound = 0;
                } else {
                    decimalsToRound = maxPriceDigits - price.split('.')[0].length - 1;
                    decimalsToRound = decimalsToRound > 2 ? 2 : decimalsToRound;
                    decimalsToRound = decimalsToRound < 0 ? 0 : decimalsToRound;
                }

                stockQuotes.push({
                    symbol: stock === '^GSPC' ? 'SP500' : stock,
                    current: Util.roundDecimals(newData.c, decimalsToRound),
                    time: Util.formatTime(newData.t*1000),
                    open: Util.roundDecimals(newData.o, decimalsToRound),
                    low: Util.roundDecimals(newData.l, decimalsToRound),
                    high: Util.roundDecimals(newData.h, decimalsToRound),
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
                        <h2 className='dash-horizontal-offset-10'>Stock Quotes</h2>
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