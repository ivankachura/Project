import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, handler } from "../timer";
import krest from "../assets/img/krest.svg";

function AuctionCreate({ state }) {
  // "lot_name": "string",
  //     "lot_description": "string",
  //     "lot_photo_path": "string",
  //     "lot_min_bet": 0,
  //     "lot_hot_price": 0,
  //     "lot_status": "ON_MODERATE",
  //     "lot_begin_datetime": "2023-04-11T21:18:31.809Z",
  //     "lot_end_datetime": "2023-04-11T21:18:31.809Z"
  const [lotCat, setLotCat] = useState(0);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [bet, setBet] = useState("");
  const [hotPrice, setHotPrice] = useState("");
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [photo, setPhoto] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios({
      method: "get",
      url: API_URL + "auctions/category_short",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: {},
    })
      .then(function (response) {
        setCategories(response.data);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  function send() {
    console.log(lotCat);
    axios({
      method: "post",
      url: API_URL + "auction",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        lot_category_id: lotCat,
        lot_name: name,
        lot_description: desc,
        lot_min_bet: parseFloat(bet),
        lot_hot_price: parseFloat(hotPrice),
        lot_begin_datetime: beginTime,
        lot_end_datetime: endTime,
        lot_photo: photo,
      },
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="back">
      <div className="to_vendor_form">
        <img onClick={() => state(false)} src={krest} alt="cross" />
        <div className="to_vendor_form_block">
          <p className="head">Создать</p>
          <input
            value={name}
            onChange={(e) => handler(e, setName)}
            type="text"
            name="lot_name"
            placeholder="Имя товара"
          />
          {categories.length > 0 && (
            <select value={lotCat} onChange={(e) => setLotCat(e.target.value)}>
              <option>Выберите категорию</option>
              {categories.map((category, i) => (
                <option key={i} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          <textarea
            name="lot_description"
            placeholder="Описание"
            value={desc}
            onChange={(e) => handler(e, setDesc)}
          ></textarea>
          <input
            value={bet}
            onChange={(e) => handler(e, setBet)}
            type="text"
            name="lot_min_bet"
            placeholder="Ставка"
          />
          <input
            value={hotPrice}
            onChange={(e) => handler(e, setHotPrice)}
            type="text"
            name="lot_hot_price"
            placeholder="Цена быстрой продажи"
          />
          <input
            value={beginTime}
            onChange={(e) => handler(e, setBeginTime)}
            type="datetime-local"
            name="lot_begin_datetime"
            placeholder="Время начала аукциона"
          />
          <input
            value={endTime}
            onChange={(e) => handler(e, setEndTime)}
            type="datetime-local"
            name="lot_end_datetime"
            placeholder="Время конца аукциона"
          />
          <input
            onChange={(e) => setPhoto(e.target.files[0])}
            type="file"
            name="avatar"
            accept="image/png, image/jpeg"
          />
          <button onClick={send}>Создать</button>
        </div>
      </div>
    </div>
  );
}

export default AuctionCreate;
