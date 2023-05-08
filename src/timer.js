import axios from "axios";

const _second = 1000;
const _minute = _second * 60;
const _hour = _minute * 60;
const _day = _hour * 24;
const URL = 'http://127.0.0.1:8000/'
export const API_URL = URL + 'api_v1/'
export const API_LOGIN = URL + 'auth/'
export const IMG_URL = URL + 'static'

export async function checkToken(token) {
    try {
        const response = await axios({
            method: 'get',
            url:
                API_URL + 'me',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (err) {
        console.error(err);
    }
}
export function handler(e, state) {
    state(e.target.value)
}

export function startTimer (setState, timer, time) {
    if (time === null) {
        return;
    }
    let date = prepareTime(time)
    function showRemaining() {
        const distance = new Date(date) - new Date();
        if (distance < 0) {
            clearInterval(timer);
            setState({})
            return;
        }
        let timeObj = {}
        timeObj["Дни"] = Math.floor(distance / _day);
        timeObj["Часы"] = Math.floor((distance % _day) / _hour);
        timeObj["Минуты"] = Math.floor((distance % _hour) / _minute);
        timeObj["Секунды"] = Math.floor((distance % _minute) / _second);
        setState(timeObj)
    }
    timer = setInterval(showRemaining, 1000);
}


export function prepareTime(timeIn) {
    return Date.parse( timeIn.replace( /[-]/g, '/' ).replace( "T", ' ' ).split('.')[0] );
}