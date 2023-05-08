import React, {useEffect, useState} from "react";
import axios from "axios";
import Lot from "../components/Lot";
import Category from "../components/Category";

import lot from "../assets/img/lot.png";
import category_back from "../assets/img/categoty_back.jpg";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {API_URL} from "../timer";
function Main() {
    const [activeAuctions, setActiveAuctions] = useState([])
    const [categories, setCategories] = useState([])
    const [closedAuctions, setClosedAuctions] = useState([])
    useEffect(() => {
        axios({
            method: 'get',
            url:
                API_URL + 'auctions/status/OPEN',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                setActiveAuctions(response.data)
            })
            .catch(function (error) {
                // обработка ошибок
                console.log(error);
            });

        axios({
            method: 'get',
            url:
                API_URL + 'auctions/category',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                setCategories(response.data)
            })
            .catch(function (error) {
                // обработка ошибок
                console.log(error);
            });

        axios({
            method: 'get',
            url:
                API_URL + 'auctions/status/CLOSED',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(function (response) {
                setClosedAuctions(response.data)
            })
            .catch(function (error) {
                // обработка ошибок
                console.log(error);
            });
    }, [])
    return(
        <>
            <section>
                <div className="cont">
                    <h2>Актуальные аукционы</h2>
                    <div className="line"></div>
                    {activeAuctions.length > 0 ? <div className="grid_auctions">
                            {activeAuctions && activeAuctions.map((data, i) =>
                                <Lot key={i} data={data} />
                            )}
                        </div> :
                        <p className="nothing">SUUUS</p>
                    }
                </div>
            </section>

            <section>
                <div className="cont categories">
                    {categories.length > 0 ? <>
                            {categories && categories.map((category, i) =>
                                <Category key={i} data={category} />
                            )}
                        </> :
                        <p className="nothing">SUUUS</p>
                    }
                </div>
            </section>
            <section>
                <div className="cont">
                    <h2>Последние аукционы</h2>
                    <div className="line"></div>
                    {closedAuctions.length > 0 ? <div className="grid_auctions">
                        {closedAuctions && closedAuctions.map((data, i) =>
                            <Lot key={i} data={data} />
                        )}
                    </div> :
                        <p className="nothing">SUUUS</p>
                    }
                </div>
            </section>
        </>
    );
}

export default Main;