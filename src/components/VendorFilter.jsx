import React from "react";
import {Link} from "react-router-dom";
import no_ava from "../assets/img/no_ava.jpg"
import {IMG_URL} from "../timer";

function VendorFilter({ data }) {
    const { id, vendor_name, vendor_photo_path } = data;
    return (
        <Link to={`/vendor?id=${id}`} className="filter_vendor">
            {vendor_photo_path !== null ?
                <img src={IMG_URL + vendor_photo_path} alt="" /> :
                <img src={no_ava} alt="" />
            }
            <p>{vendor_name}</p>
        </Link>
    );
}

export default VendorFilter;