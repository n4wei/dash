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

var Util = {
    formatHour: function(timeStr) {
        let parts = new Date(timeStr).toLocaleTimeString('en-US').split(':');
        return parts[0] + parts[2].split(' ')[1];
    },

    formatTime: function(timeStr) {
        return new Date(timeStr).toLocaleTimeString('en-US', timeFormatOpts);
    },

    formatDate: function(timeStr) {
        return new Date(timeStr).toLocaleDateString('en-US', dateFormatOpts)
    },

    formatTimeLexi: function(timeStr) {
        return new Date(timeStr).toLocaleTimeString('en-US', {hour12:false});
    },

    roundDecimals: function(num, decimals) {
        return Number(Math.round(num+'e'+decimals)+'e-'+decimals);
    },
};

export default Util;