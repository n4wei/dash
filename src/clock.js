import React from 'react';

const updateInterval = 1000; // 1 second

class Clock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: this.getTime(),
        };
    };

    componentDidMount() {
        this.intervalID = setInterval(() => {
            this.setState({
                time: this.getTime(),
            });
        }, updateInterval);
    };

    componentWillUnmount() {
        clearInterval(this.intervalID);
    };

    getTime() {
        let date = new Date();
        return this.pad(date.getHours()) + ':' + this.pad(date.getMinutes());
    };

    pad(num) {
        return num < 10 ? '0'+num : num;
    };

    render() {
        return <>{this.state.time}</>
    };
};

export default Clock;