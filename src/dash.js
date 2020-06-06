import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CardDeck from 'react-bootstrap/CardDeck';
import Button from 'react-bootstrap/Button';

import Clock from './clock.js';
import WeatherCard from './weather_card.js';
import StockQuoteCard from './stock_quote_card.js';
import Secrets from './secrets.json';

const numWeatherHoursToDisplay = 6;

const stocks = [
    {symbol: 'BOX', decimals: 2},
    {symbol: 'GILD', decimals: 2},
    {symbol: '^GSPC', decimals: 0},
];

const timeFormatOpts = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
};

const dateFormatOpts = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
};

var formatHour = (timeStr) => {
    let parts = new Date(timeStr).toLocaleTimeString('en-US').split(':');
    return parts[0] + parts[2].split(' ')[1];
};

var formatTime = (timeStr) => new Date(timeStr).toLocaleTimeString('en-US', timeFormatOpts);

var roundDecimals = (num, decimals) => Number(Math.round(num+'e'+decimals)+'e-'+decimals);

class Dash extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            location: {},
            weather_original: [],
            uv_original: [],
            weather: [],
            stockQuotes: [],
        };

        this.refreshWeather();
        this.refreshStockQuotes();
    };

    async getWeatherDataFromAPI() {
        const response = await fetch('https://api.climacell.co/v3/weather/forecast/hourly?lat='+this.state.location.lat+'&lon='+this.state.location.lng+'&unit_system=us&start_time=now&fields=temp%2Chumidity%2Cprecipitation_type%2Cprecipitation_probability%2Csunrise%2Csunset%2Ccloud_cover%2Cweather_code%2Cepa_aqi%2Cepa_primary_pollutant%2Cepa_health_concern%2Cpollen_tree%2Cpollen_weed%2Cpollen_grass&apikey='+Secrets.climacell_token, {
            'method': 'GET',
        })
        .catch(err => console.error(err));
        return response.json();
    };

    async getUVDataFromAPI() {
        const response = await fetch('https://api.openuv.io/api/v1/forecast?lat='+this.state.location.lat+'&lng='+this.state.location.lng, {
            'method': 'GET',
            'headers': {
                'x-access-token': Secrets.openuv_token,
            }
        })
        .catch(err => console.error(err));
        return response.json();
    }

    async getStockQuoteDataFromAPI(symbol) {
        const response = await fetch('https://finnhub.io/api/v1/quote?symbol='+symbol+'&token='+Secrets.finnhub_token, {
            'method': 'GET',
        })
        .catch(err => console.error(err));
        return response.json();
    };

    formatWeatherData(weatherData) {
        return weatherData.slice(0,numWeatherHoursToDisplay).map((hourData) => {
            hourData.hour = formatHour(hourData.observation_time.value);
            hourData.temp.value = roundDecimals(hourData.temp.value, 1);
            hourData.uv_index = '-';
            hourData.cloud_cover.value = Math.round(hourData.cloud_cover.value);
            hourData.precipitation_probability.value = Math.round(hourData.precipitation_probability.value);
            hourData.humidity.value = Math.round(hourData.humidity.value);
            hourData.pollen_g = hourData.pollen_grass.value === null ? '-' : hourData.pollen_grass.value;
            hourData.pollen_t = hourData.pollen_tree.value === null ? '-' : hourData.pollen_tree.value;
            hourData.pollen_w = hourData.pollen_weed.value === null ? '-' : hourData.pollen_weed.value;
            return hourData;
        });
    };

    mergeUVData(uvData, weatherData) {
        uvData.forEach((hourUVData) => {
            let formattedHour = formatHour(hourUVData.uv_time);
            weatherData = weatherData.map((hourWeatherData) => {
                if (hourWeatherData.hour === formattedHour) {
                    hourWeatherData.uv_index = roundDecimals(hourUVData.uv, 1);
                }
                return hourWeatherData;
            });
        });
        return weatherData;
    };

    getLatestUVData(weatherData_original, weatherData) {
        let uv_original = this.state.uv_original.slice();
        let shouldGetNewUVData = false;

        if (uv_original.length === 0) {
            shouldGetNewUVData = true;
        } else {
            let currentTime = new Date().toISOString();
            let i = 0;
            while (i < uv_original.length && new Date(uv_original[i].uv_time).toISOString() <= currentTime) {
                i++
            }
            if (i === uv_original.length) {
                shouldGetNewUVData = true;
            } else {
                uv_original = uv_original.slice(i-1);
                console.log('sliced', uv_original);
            }
        }

        if (shouldGetNewUVData) {
            this.getUVDataFromAPI().then((newUVData) => {
                newUVData = newUVData.result;
                console.log('new', newUVData);
                this.setState({
                    location: this.state.location,
                    weather_original: weatherData_original.slice(),
                    uv_original: newUVData.slice(),
                    weather: this.mergeUVData(newUVData, weatherData),
                    stockQuotes: this.state.stockQuotes,
                });
            });
        } else {
            this.setState({
                location: this.state.location,
                weather_original: weatherData_original.slice(),
                uv_original: uv_original,
                weather: this.mergeUVData(uv_original, weatherData),
                stockQuotes: this.state.stockQuotes,
            });
        }
    };

    getLatestWeatherData() {
        let weather_original = this.state.weather_original.slice();
        let shouldGetNewWeatherData = false;

        if (weather_original.length === 0) {
            shouldGetNewWeatherData = true;
        } else {
            let currentTime = new Date().toISOString();
            let i = 0;
            while (i < weather_original.length && new Date(weather_original[i].observation_time.value).toISOString() <= currentTime) {
                i++
            }
            weather_original = weather_original.slice(i-1);
            console.log('sliced', weather_original);
            if (weather_original.length < numWeatherHoursToDisplay) {
                shouldGetNewWeatherData = true;
            }
        }

        if (shouldGetNewWeatherData) {
            this.getWeatherDataFromAPI().then((newWeatherData) => {
                console.log('new', newWeatherData);
                this.getLatestUVData(newWeatherData, this.formatWeatherData(newWeatherData));
            });
        } else {
            this.getLatestUVData(weather_original, this.formatWeatherData(weather_original));
        }
    };

    refreshWeather() {
        if (Object.keys(this.state.location).length === 0) {
            navigator.geolocation.getCurrentPosition((data) => {
                this.setState({
                    location: {
                        lat: data.coords.latitude,
                        lng: data.coords.longitude,
                    },
                    weather_original: this.state.weather_original,
                    uv_original: this.state.uv_original,
                    weather: this.state.weather,
                    stockQuotes: this.state.stockQuotes,
                });
    
                this.getLatestWeatherData();
            }, (err) => {
                console.error(err);
            });
        } else {
            this.getLatestWeatherData();
        }
    };

    refreshStockQuotes() {
        let stockQuotes = [];
        stocks.forEach((stock) => {
            this.getStockQuoteDataFromAPI(stock.symbol).then((data) => {
                console.log('new', data);
                stockQuotes.push({
                    symbol: stock.symbol === '^GSPC' ? 'SP500' : stock.symbol,
                    time: formatTime(data.t*1000),
                    current: roundDecimals(data.c, stock.decimals),
                    open: roundDecimals(data.o, stock.decimals),
                    low: roundDecimals(data.l, stock.decimals),
                    high: roundDecimals(data.h, stock.decimals),
                    prev_close: roundDecimals(data.pc, stock.decimals),
                });

                if (stockQuotes.length === stocks.length) {
                    this.setState({
                        location: this.state.location,
                        weather_original: this.state.weather_original,
                        uv_original: this.state.uv_original,
                        weather: this.state.weather,
                        stockQuotes: stockQuotes,
                    });
                }
            });
        });
    };

    render() {
        let sunrise, sunset, weatherCards;
        if (this.state.weather.length > 0) {
            const weatherData = this.state.weather.slice();
            sunrise = formatTime(weatherData[0].sunrise.value);
            sunset = formatTime(weatherData[0].sunset.value);
            weatherCards = weatherData.map((weatherData, i) => {
                return <WeatherCard key={i} data={weatherData}></WeatherCard>;
            });
        }

        let stockQuoteCards;
        if (this.state.stockQuotes.length > 0) {
            const stockQuoteData = this.state.stockQuotes.slice();
            stockQuoteCards = stockQuoteData.map((stockQuoteData, i) => {
                return <StockQuoteCard key={i} data={stockQuoteData}></StockQuoteCard>;
            });
        }

        return (
            <Container>
                <Row><Col><h1><Clock/></h1></Col></Row>
                <Row><Col><h2>{new Date().toLocaleDateString('en-US', dateFormatOpts)}</h2></Col></Row>
                <Row><h3>{'---'}</h3></Row>
                <Row>
                    <Col><h2>Weather - <i className='wi wi-sunrise'> {sunrise}</i>{' / '}<i className='wi wi-horizon'> {sunset}</i></h2></Col>
                    <Col><Button variant='primary' onClick={()=>this.refreshWeather()}><i className='wi wi-refresh'/></Button></Col>
                </Row>
                <Row><CardDeck>{weatherCards}</CardDeck></Row>
                <Row><h3>{'---'}</h3></Row>
                <Row>
                    <Col><h2>Stock Quotes</h2></Col>
                    <Col><Button variant='primary' onClick={()=>this.refreshStockQuotes()}><i className='wi wi-refresh'/></Button></Col>
                </Row>
                <Row><CardDeck>{stockQuoteCards}</CardDeck></Row>
            </Container>
        );
    };
};

export default Dash;