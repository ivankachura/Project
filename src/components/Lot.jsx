import React, { useEffect, useState } from "react";

import { startTimer } from "../timer";
import eye from "../assets/img/eye.svg";
import no_photo from "../assets/img/no_photo.jpg";
import { Link } from "react-router-dom";
import { logDOM } from "@testing-library/react";
import { IMG_URL } from "../timer";

function Lot({ data }) {
  const {
    lot_photo_path,
    lot_name,
    lot_end_datetime,
    current_bet,
    id,
    lot_status,
  } = data;
  const [time, setTime] = useState({});
  const [bid, setBid] = useState(0);

  // let MySQLDate = "2023-05-12T11:40:10.048321";
  let timer;

  useEffect(() => {
    console.log(lot_photo_path);
    if (current_bet !== undefined) {
      if (lot_status !== "CLOSED" && current_bet !== null) {
        setBid(current_bet);
      }
      if (lot_status === "CLOSED") {
        setBid(null);
      }
    } else {
      setBid(null);
    }
    if (lot_end_datetime !== undefined) {
      startTimer(setTime, timer, lot_end_datetime);
    }
  }, []);
  return (
    <div className="lot">
      <div className="img_frag">
        {lot_photo_path === null ? (
          <img className="lot_img" src={no_photo} alt="" />
        ) : (
          <img className="lot_img" src={IMG_URL + lot_photo_path} alt="" />
        )}
        <div className="lot_btns">
          <Link to={`/lot?id=${id}`} className="btn_lot eye">
            <img src={eye} alt="eye" />
          </Link>
        </div>
        {Object.keys(time).length !== 0 && (
          <div className="time_info">
            <p className="time_head">Осталось времени:</p>
            <div className="time_sectors">
              {Object.keys(time).map((keyName, i) => (
                <div key={i + keyName} className="time_sector">
                  <p className="time_num">{time[keyName]}</p>
                  <p className="time_type">{keyName}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="text_frag">
        <h3 className="name_lot">{lot_name}</h3>
        {bid !== null ? (
          <p className="status">
            Активен: <span>{bid} ₽</span>
          </p>
        ) : (
          <p className="status">Прошедший</p>
        )}
      </div>
    </div>
  );
}

export default Lot;
