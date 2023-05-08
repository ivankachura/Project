import React, {useEffect, useState} from "react";

import ava from "../assets/img/ava.png"
import {Link} from "react-router-dom";
import axios from "axios";
import {API_URL, IMG_URL} from "../timer";
function Vendors() {
    const vendor = {
        id: 1,
        vendor_name: "Тони Старк",
        vendor_photo_path: ava
    }
    const [vendors, setVendors] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url:
                API_URL + 'vendors',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                setVendors(response.data)
            })
            .catch(function (error) {
                // обработка ошибок
                console.log(error);
            });
    }, [])
    return (
        <section>
            <div className="cont">
                <p className="total_info">
                    Показано продавцов: {vendors.length}
                </p>
                <div className="vendor_grid">
                    {vendors.length > 0 && vendors.map((vendor, i) =>
                        <div key={i} className="vendor_plate">
                            <p className="vendor_name">{vendor.vendor_name}</p>
                            <img src={IMG_URL + vendor.vendor_photo_path} alt=""/>
                            <Link to={`/vendor?id=${vendor.id}`}>О продавце</Link>
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
}

export default Vendors;