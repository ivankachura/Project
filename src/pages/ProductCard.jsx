import React, { useEffect, useRef, useState } from "react";

import lot from "../assets/img/lot.png";
import ava from "../assets/img/ava.png";
import map from "../assets/img/map.svg";
import phone from "../assets/img/phone.svg";

import { IMG_URL, checkToken, prepareTime, startTimer } from "../timer";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import web from "../assets/img/web.svg";
import no_photo from "../assets/img/no_photo.jpg";
import Lot from "../components/Lot";
import axios from "axios";
import { API_URL } from "../timer";
import no_ava from "../assets/img/no_ava.jpg";
import { logDOM } from "@testing-library/react";
function ProductCard() {
  const [queryParameters] = useSearchParams();
  const [auction, setAuction] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [bet, setBet] = useState(0);
  const [minBet, setMinBet] = useState(0);
  function checkInput(e) {
    e.target.value < minBet ? setBet(minBet) : setBet(e.target.value);
  }

  function postBet() {
    if (bet > minBet) {
      checkToken(localStorage.getItem("token")).then(function (response) {
        console.log(response);
        if (response !== undefined) {
          axios({
            method: "post",
            url: `${API_URL}auction/${queryParameters.get(
              "id"
            )}/bet?bet_size=${bet}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then(function (response) {})
            .catch(function (error) {
              console.log(error);
            });
        } else {
          alert("Залогиньтесь, сус!");
          localStorage.removeItem("token");
        }
      });
    } else {
      alert("Ставка меньше суса, не сусайте!");
    }
  }
  function buyBet() {
    // localStorage
    checkToken(localStorage.getItem("token")).then(function (response) {
      if (response !== undefined) {
        axios({
          method: "post",
          url: `${API_URL}auction/${queryParameters.get("id")}/buy_now`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        alert("Залогиньтесь, сус!");
        localStorage.removeItem("token");
      }
    });
  }

  let timer;
  const [time, setTime] = useState({});
  useEffect(() => {
    axios({
      method: "get",
      url: API_URL + "auction/" + queryParameters.get("id"),
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        console.log(response.data);
        let data = response.data;
        if (Array.isArray(data.auction_bets)) {
          data.auction_bets.sort();
          data.auction_bets.reverse();
        }
        setMinBet(
          data.auction_bets.length > 0
            ? data.auction_bets[0].bet_size
            : data.lot_min_bet
        );
        setBet(
          data.auction_bets.length > 0
            ? data.auction_bets[0].bet_size
            : data.lot_min_bet
        );
        if (data.lot_end_datetime !== undefined) {
          startTimer(setTime, timer, data.lot_end_datetime);
        }
        setAuction(data);
        axios({
          method: "get",
          url: API_URL + "auctions/vendor/" + data.lot_vendor.id,
          headers: { "Content-Type": "application/json" },
        })
          .then(function (response) {
            setProducts(response.data);
          })
          .catch(function (error) {
            // обработка ошибок
            console.log(error);
          });
      })
      .catch(function (error) {
        // обработка ошибок
        navigate("/error");
        console.log(error);
      });
  }, []);

  const ws = useRef(null);
  const [responseWS, setResponseWS] = useState(null);
  useEffect(() => {
    ws.current = new WebSocket(
      "ws://127.0.0.1:8000/ws/" + queryParameters.get("id")
    ); // создаем ws соединение
    ws.current.onopen = () => console.log("Соединение открыто"); // callback на ивент открытия соединения
    ws.current.onclose = () => console.log("Соединение закрыто"); // callback на ивент закрытия соединения
    gettingData();
  }, [ws]);
  function gettingData() {
    ws.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log(message);
      if (message.event_type === "close") {
        window.location.reload();
      } else {
        setResponseWS(message);
      }
    };
  }

  useEffect(() => {
    responseWS &&
      setAuction({
        ...auction,
        auction_bets: [
          {
            bet_datetime: responseWS.datetime,
            bet_size: parseInt(responseWS.bet_size),
            bet_user: {
              username: responseWS.user,
            },
          },
          ...auction.auction_bets,
        ],
      });
  }, [responseWS]);

  const [tab, setTab] = useState(0);

  function tabHandler(e) {
    setTab(e);
    console.log(auction);
  }
  return (
    <section>
      <div className="cont">
        {Object.keys(auction).length > 0 && (
          <>
            <h1>{auction.lot_name}</h1>
            <div className="line"></div>
            <div className="lot_first">
              <div className="lot_galery">
                {auction.lot_photo_path === null ? (
                  <img className="lot_main" src={no_photo} alt="" />
                ) : (
                  <img
                    className="lot_main"
                    src={IMG_URL + auction.lot_photo_path}
                    alt=""
                  />
                )}

                {/*<div className="lot_carusel">*/}
                {/*    {prod.imagesCarousel && prod.imagesCarousel.map((image, index) =>*/}
                {/*        <img key={index} src={image} alt="" />*/}
                {/*    )}*/}
                {/*</div>*/}
              </div>
              <div className="lot_info">
                <p className="lot_desc">{auction.lot_description}</p>
                {auction.lot_status === "OPEN" ? (
                  <p className="lot_bid">
                    {auction.auction_bets.length > 0
                      ? `Текущая ставка: ${auction.auction_bets[0].bet_size} ₽`
                      : auction.lot_min_bet !== null
                      ? `Текущая ставка: ${auction.lot_min_bet} ₽`
                      : "Прошедший аукцион"}
                  </p>
                ) : (
                  <p className="lot_bid">
                    {auction.auction_bets.length > 0
                      ? `Лот продан за ${auction.auction_bets[0].bet_size} ₽`
                      : auction.lot_min_bet !== null
                      ? `Лот продан за ${auction.lot_min_bet} ₽`
                      : "Прошедший аукцион"}
                  </p>
                )}
                {auction.lot_status === "OPEN" ? (
                  <div className="lot_time">
                    <p className="lot_time_head">Осталось времени:</p>
                    <div className="lot_time_sectors">
                      {Object.keys(time).map((keyName, i) => (
                        <div key={i + keyName} className="lot_time_sector">
                          <p className="lot_time_num">{time[keyName]}</p>
                          <p className="lot_time_type">{keyName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="lot_time_head_result">Прошёл</p>
                )}
                {auction.lot_status === "OPEN" && (
                  <div className="lot_form">
                    <label htmlFor="bid">
                      <input
                        value={bet}
                        onChange={(e) => checkInput(e)}
                        min={
                          auction.auction_bets.length > 0
                            ? auction.auction_bets[0].bet_size
                            : auction.lot_min_bet
                        }
                        type="number"
                        name="bid"
                        id="bid"
                      />
                      <button onClick={postBet}>Ставка</button>
                    </label>
                    <button onClick={buyBet} className="lot_buy">
                      Купить сейчас за {auction.lot_hot_price} ₽
                    </button>
                  </div>
                )}

                <p className="lot_category">
                  Категория:{" "}
                  <Link to={`/auctions?category=${auction.category.id}`}>
                    {auction.category.name}
                  </Link>
                </p>
              </div>
            </div>
            <div className="lot_second">
              <ul className="lot_tabs">
                <li
                  className={tab === 0 ? "active" : undefined}
                  onClick={() => {
                    tabHandler(0);
                  }}
                >
                  Описание
                </li>
                <li
                  className={tab === 1 ? "active" : undefined}
                  onClick={() => {
                    tabHandler(1);
                  }}
                >
                  История аукциона
                </li>
                <li
                  className={tab === 2 ? "active" : undefined}
                  onClick={() => {
                    tabHandler(2);
                  }}
                >
                  О продавце
                </li>
              </ul>
              {tab === 0 && (
                <p className="lot_description active">
                  {auction.lot_description}
                </p>
              )}
              {tab === 1 && (
                <div className="lot_history active">
                  <div className="row_title">
                    <div className="col">Время</div>
                    <div className="col">Ставка</div>
                    <div className="col">Пользователь</div>
                  </div>
                  {auction.auction_bets &&
                    auction.auction_bets.map((obj, index) => (
                      <div key={index} className="row">
                        <div className="col">
                          {new Date(prepareTime(obj.bet_datetime)).toString()}
                        </div>
                        <div className="col">{obj.bet_size}</div>
                        <div className="col">
                          {obj.event_type === "bet"
                            ? obj.username
                            : obj.bet_user !== null
                            ? obj.bet_user.username
                            : auction.lot_vendor.vendor_name}
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {tab === 2 && (
                <div className="lot_vendor active">
                  <div className="card_vendor">
                    {auction.lot_vendor.vendor_photo_path !== null ? (
                      <img
                        src={IMG_URL + auction.lot_vendor.vendor_photo_path}
                        alt=""
                      />
                    ) : (
                      <img src={no_ava} alt="" />
                    )}
                    <p>{auction.lot_vendor.vendor_name}</p>
                  </div>
                  <div className="vendor_string">
                    <img src={map} alt="" />
                    <p>{auction.lot_vendor.store_address}</p>
                  </div>
                  <div className="vendor_string">
                    <img src={phone} alt="" />
                    <Link to={`tel:${auction.lot_vendor.store_phone_number}`}>
                      {auction.lot_vendor.store_phone_number}
                    </Link>
                  </div>
                  <div className="vendor_string">
                    <img src={web} alt="" />
                    <Link to={auction.lot_vendor.store_site}>
                      {auction.lot_vendor.store_site}
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {products.length > 0 && (
              <div className="lot_products">
                <h2>Продукты продавца</h2>
                <div className="grid_auctions">
                  {products.map((product, i) => (
                    <Lot key={i} data={product} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProductCard;
