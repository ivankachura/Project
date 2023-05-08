import React, {useState} from "react";
import axios from "axios";
import {API_URL, handler} from "../timer";
import krest from "../assets/img/krest.svg"

function VendorCreate({ state, vendor_name }) {
        // шляпСУСы
        // 89994594213
        // https://goga.ai/
        // г. Рязань, ул. СУСанина, д. 9, этаж 9
    const [storeName, setStoreName] = useState("")
    const [number, setNumber] = useState("")
    const [site, setSite] = useState("")
    const [address, setAddress] = useState("")
    const [photo, setPhoto] = useState("")

    function send() {
        if (!!vendor_name && !!storeName && !!number && !!site && !!address && !!photo) {
            axios({
                method: 'post',
                url: API_URL + "vendors",
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
                data: {
                    vendor_name: vendor_name,
                    store_name: storeName,
                    store_phone_number: number,
                    store_site: site,
                    store_address: address,
                    vendor_photo: photo
                }
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        else {
            alert("ЗАПОЛНИТЕ ВСЁ")
        }
    }

    return (
        <div className="back">
            <div className="to_vendor_form">
                <img onClick={() => state(false)} src={krest} alt="cross"/>
                <div className="to_vendor_form_block">
                    <p className="head">Регистрация продавца</p>
                    <input value={storeName} onChange={(e) => handler(e, setStoreName)} type="text" name="store_name" placeholder="Имя магазина"/>
                    <input value={number} onChange={(e) => handler(e, setNumber)} type="text" name="store_phone_number" placeholder="Номер телефона"/>
                    <input value={site} onChange={(e) => handler(e, setSite)} type="text" name="store_name" placeholder="Ссылка на сайт"/>
                    <input value={address} onChange={(e) => handler(e, setAddress)} type="text" name="address" placeholder="Адрес магазина"/>
                    <input onChange={(e) => setPhoto(e.target.files[0])} type="file" name="avatar" accept="image/png, image/jpeg"/>
                    <button onClick={send}>Зарегистрироваться</button>
                </div>
            </div>
        </div>
    );
}

export default VendorCreate