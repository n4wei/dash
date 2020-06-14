const timeFormatOpts = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
};

const weekdays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

var Util = {
    formatHour: function(timeStr) {
        let parts = new Date(timeStr).toLocaleTimeString('en-US').split(':');
        return parts[0] + parts[2].split(' ')[1];
    },

    formatWeekday: function(timeStr) {
        return weekdays[new Date(timeStr).getUTCDay()];
    },

    formatTime: function(timeStr) {
        return new Date(timeStr).toLocaleTimeString('en-US', timeFormatOpts);
    },

    formatTimeLexi: function(timeStr) {
        return new Date(timeStr).toLocaleTimeString('en-US', {hour12:false});
    },

    formatDateISOLocal: function(timeObj) {
        let month = timeObj.getMonth()+1;
        month = month < 10 ? '0'+month : month;
        let date = timeObj.getDate();
        date = date < 10 ? '0'+date : date;
        return timeObj.getFullYear() + '-' + month + '-' + date;
    },

    roundDecimals: function(num, decimals) {
        decimals = decimals < 0 ? 0 : decimals;
        return Number(Math.round(num+'e'+decimals)+'e-'+decimals);
    },
};

export default Util;