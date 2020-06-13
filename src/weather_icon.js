import React from 'react';
import Util from './util.js';

function WeatherIcon(props) {
    let icon, dayTime;
    if (props.forceDaytime === true) {
        dayTime = true
    } else {
        let currentTime = Util.formatTimeLexi(props.data.observation_time.value);
        let sunriseTime = Util.formatTimeLexi(props.data.sunrise.value);
        let sunsetTime = Util.formatTimeLexi(props.data.sunset.value);
        dayTime = currentTime >= sunriseTime && currentTime < sunsetTime ? true : false;
    }

    switch(props.data.weather_code.value) {
        case 'clear':
            icon = dayTime? <i className='wi wi-day-sunny'></i> : <i className='wi wi-night-clear'></i>;
            break;
        case 'mostly_clear':
            icon = dayTime? <i className='wi wi-day-sunny-overcast'></i> : <i className='wi wi-night-alt-partly-cloudy'></i>;
            break;
        case 'partly_cloudy':
            icon = dayTime? <i className='wi wi-day-cloudy'></i> : <i className='wi wi-night-alt-cloudy'></i>;
            break;
        case 'cloudy':
            icon = <i className='wi wi-cloud'></i>;
            break;
        case 'mostly_cloudy':
            icon = <i className='wi wi-cloudy'></i>;
            break;
        case 'fog_light':
            icon = <i className='wi wi-fog'></i>;
            break;
        case 'fog':
            icon = <i className='wi wi-fog'></i>;
            break;
        case 'drizzle':
            icon = <i className='wi wi-sprinkle'></i>;
            break;
        case 'rain_light':
            icon = <i className='wi wi-sprinkle'></i>;
            break;
        case 'rain':
            icon = <i className='wi wi-showers'></i>;
            break;
        case 'rain_heavy':
            icon = <i className='wi wi-rain'></i>;
            break;
        case 'tstorm':
            icon = <i className='wi wi-thunderstorm'></i>;
            break;
        case 'freezing_drizzle':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-sprinkle'></i></>;
            break;
        case 'freezing_rain_light':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-sprinkle'></i></>;
            break;
        case 'freezing_rain':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-showers'></i></>;
            break;
        case 'freezing_rain_heavy':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-rain'></i></>;
            break;
        case 'ice_pellets_light':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-sleet'></i></>;
            break;
        case 'ice_pellets':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-rain-mix'></i></>;
            break;
        case 'ice_pellets_heavy':
            icon = <><i className='wi wi-snowflake-cold'></i><i className='wi wi-hail'></i></>;
            break;
        case 'flurries':
            icon = <i className='wi wi-snowflake-cold'></i>;
            break;
        case 'snow_light':
            icon = <i className='wi wi-snowflake-cold'></i>;
            break;
        case 'snow':
            icon = <i className='wi wi-snow'></i>;
            break;
        case 'snow_heavy':
            icon = <><i className='wi wi-strong-wind'></i><i className='wi wi-snow'></i></>;
            break;
        default:
            icon = <i className='wi wi-train'></i>;
    };

    return icon;
};

export default WeatherIcon;