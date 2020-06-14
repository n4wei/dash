import React from 'react';

const updateInterval = 60*1000; // 1 minute

const formatOpts = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
};

class Day extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            day: this.getDay(),
        };
    };

    componentDidMount() {
        this.intervalID = setInterval(() => {
            this.setState({
                day: this.getDay(),
            });
        }, updateInterval);
    };

    componentWillUnmount() {
        clearInterval(this.intervalID);
    };

    getDay() {
        return new Date().toLocaleDateString('en-US', formatOpts);
    };

    render() {
        return <>{this.state.day}</>
    };
};

export default Day;