const MonthNames =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function formatDate(dateString) {
    let d = new Date(dateString);
    let date = d.getDate();
    return (date < 10 ? '0' : '') + date + '-' + MonthNames[d.getMonth()] + '-' + d.getFullYear();
}

export function formatDateTime(dateString) {
    let d = new Date(dateString);
    let date = d.getDate();
    return (date < 10 ? '0' : '') + date + '-' + MonthNames[d.getMonth()] + '-' + d.getFullYear() + ' ' + dateString.split('T')[1];
}
