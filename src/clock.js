import React from 'react';

class Clock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            time: this.getTime(),
        };
    };

    pad(num) {
        return num < 10 ? '0'+num : num;
    };

    getTime() {
        let date = new Date();
        return this.pad(date.getHours()) + ':' + this.pad(date.getMinutes());
    };

    componentDidMount() {
        this.intervalID = setInterval(() => {
            this.setState({
                time: this.getTime(),
            });
        }, 1000);
    };

    componentWillUnmount() {
        clearInterval(this.intervalID);
    };

    render() {
        return <>{this.state.time}</>
    };
};

export default Clock;