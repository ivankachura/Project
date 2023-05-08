import React from "react";
import {Link} from "react-router-dom";
import {IMG_URL} from "../timer";
import no_photo from "../assets/img/no_photo.jpg";

function AuctionFilter({ data }) {
    const { id, lot_name, lot_photo_path, current_bet } = data;
    return (
        <Link to={`/lot?id=${id}`} className="filter_auction">
            {lot_photo_path === null ?
                <img src={no_photo} alt="" /> :
                <img src={IMG_URL + lot_photo_path} alt="" />
            }

            <div className="filter_auction_info">
                <p className="filter_auction_info_name">{lot_name}</p>
                <p className="filter_auction_info_status">Активен: <span>{current_bet} ₽</span></p>
            </div>
        </Link>
    );
}

export default AuctionFilter;