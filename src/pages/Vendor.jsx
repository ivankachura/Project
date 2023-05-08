import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Lot from "../components/Lot";

import ava from "../assets/img/ava.png";
import map from "../assets/img/map.svg";
import phone from "../assets/img/phone.svg";
import web from "../assets/img/web.svg";
import lot from "../assets/img/lot.png";
import axios from "axios";
import { API_URL, IMG_URL } from "../timer";

function Vendor() {
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const vendorId = queryParameters.get("id");
  const [vendor, setVendor] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios({
      method: "get",
      url: API_URL + "vendor/" + vendorId,
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        setVendor(response.data);
      })
      .catch(function (error) {
        // обработка ошибок
        navigate("/error");
        console.log(error);
      });
    axios({
      method: "get",
      url: API_URL + "auctions/vendor/" + vendorId,
      headers: { "Content-Type": "application/json" },
    })
      .then(function (response) {
        setProducts(response.data);
      })
      .catch(function (error) {
        // обработка ошибок
        console.log(error);
      });
  }, []);
  const lotInfo = {
    image: lot,
    name: "Шляпы Ивана",
    timeIn: "2023-05-12T11:40:10.048321",
    bidIn: "73Битка",
  };
  // const info = {
  //     vendor_name: "Тони старк",
  //     store_name: "Магазин у Али Бабы",
  //     store_phone_number: "89952455313",
  //     store_site: "tony-top.com",
  //     store_address: "ул. Строителей, д.10, 5 этаж",
  //     vendor_photo_path: ava,
  //     id: 1,
  // }
  return (
    <section>
      <div className="cont vendor">
        <div className="vendor_block">
          <div className="vendor_left">
            <img
              className="vendor_ava"
              src={IMG_URL + vendor.vendor_photo_path}
              alt=""
            />
            <p className="vendor_title">{vendor.vendor_name}</p>
            <div className="vendor_info">
              <div className="vendor_string">
                <img src={map} alt="map" />
                <p>{vendor.store_address}</p>
              </div>
              <div className="vendor_string">
                <img src={phone} alt="phone" />
                <Link to={`tel:${vendor.store_phone_number}`}>
                  {vendor.store_phone_number}
                </Link>
              </div>
              <div className="vendor_string">
                <img src={web} alt="web" />
                <Link to={vendor.store_site}>{vendor.store_site}</Link>
              </div>
            </div>
          </div>
          <div className="vendor_products">
            <h2>Продукты продавца</h2>
            {products.length > 0 ? (
              <div className="vendor_products_grid">
                {products
                  .filter(
                    (data) =>
                      data.lot_status.includes("OPEN") ||
                      data.lot_status.includes("CLOSE")
                  )
                  .map((product, i) => (
                    <Lot key={i} data={product} />
                  ))}
              </div>
            ) : (
              <p className="nothing">SUUUS</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Vendor;
