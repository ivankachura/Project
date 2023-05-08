import React, { useEffect, useState } from "react";
import Lot from "../components/Lot";
import { API_LOGIN, API_URL, checkToken, IMG_URL } from "../timer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VendorCreate from "../components/VendorCreate";
import AuctionCreate from "../components/AuctionCreate";

function Lk() {
  const navigate = useNavigate();
  const [vendorIsPopup, setVendorIsPopup] = useState(false);
  const [createIsPopup, setCreateIsPopup] = useState(false);
  const [user, setUser] = useState({});
  const [products, setProducts] = useState({});
  const [buyProducts, setBuyProducts] = useState({});
  useEffect(() => {
    checkToken(localStorage.getItem("token")).then(function (response) {
      if (response !== undefined) {
        axios({
          method: "get",
          url: API_URL + "me",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then(function (response) {
            let id = response.data.id;
            let username = response.data.username;
            axios({
              method: "get",
              url: API_URL + "vendor/" + id,
              headers: { "Content-Type": "application/json" },
            })
              .then(function (response) {
                setUser({
                  id: id,
                  username: username,
                  vendor_photo_path: response.data.vendor_photo_path,
                });
                axios({
                  method: "get",
                  url: API_URL + "auctions/vendor/" + id,
                  headers: { "Content-Type": "application/json" },
                })
                  .then(function (response) {
                    setProducts(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                axios({
                  method: "get",
                  url: API_URL + "auctions/user?user_id=" + id,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                })
                  .then(function (response) {
                    setBuyProducts(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              })
              .catch(function (error) {
                setUser({
                  id: id,
                  username: username,
                  vendor_photo_path: null,
                });
                axios({
                  method: "get",
                  url: API_URL + "auctions/vendor/" + id,
                  headers: { "Content-Type": "application/json" },
                })
                  .then(function (response) {
                    setProducts(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                axios({
                  method: "get",
                  url: API_URL + "auctions/user?user_id=" + id,
                  headers: { "Content-Type": "application/json" },
                })
                  .then(function (response) {
                    setBuyProducts(response.data);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
                console.log(error);
              });
          })
          .catch(function (error) {
            navigate("/error");
          });
      } else {
        navigate("/error");
      }
    });
  }, []);

  return (
    <>
      {vendorIsPopup && (
        <VendorCreate state={setVendorIsPopup} vendor_name={user.username} />
      )}
      {createIsPopup && <AuctionCreate state={setCreateIsPopup} />}
      <section>
        <div className="cont">
          {user.vendor_photo_path !== null && (
            <img className="big_ava" src={IMG_URL + user.vendor_photo_path} />
          )}
          <h2>{user.username}</h2>
          {user.vendor_photo_path !== null ? (
            <button
              onClick={() => setCreateIsPopup(true)}
              className="to_vendor"
            >
              Выставить аукцион
            </button>
          ) : (
            <button
              onClick={() => setVendorIsPopup(true)}
              className="to_vendor"
            >
              Стать продацом
            </button>
          )}
        </div>
      </section>
      <section>
        <div className="cont">
          <div className="line"></div>
          <h2>Ваши аукционы</h2>
          {products.length > 0 ? (
            <div className="grid_auctions">
              {products.map((product, i) => (
                <Lot key={i} data={product} />
              ))}
            </div>
          ) : (
            <p className="nothing">SUUUS</p>
          )}
        </div>
      </section>
      {buyProducts.length > 0 ? (
        <section>
          <div className="cont">
            <div className="line"></div>
            <h2>Ваши выигрыши</h2>
            <div className="grid_auctions">
              {buyProducts.map((product, i) => (
                <Lot key={i} data={product} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <p className="nothing">SUUUS</p>
      )}
    </>
  );
}

export default Lk;
