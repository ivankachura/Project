import React from "react";
import {Link, useSearchParams} from "react-router-dom";
import {IMG_URL} from "../timer";

function Category({ data }) {
    const { id, category_photo_path, name, count_of_active_auctions } = data
    return(
        <div className="category" style={{ backgroundImage:`url(${IMG_URL+category_photo_path})`}} >
            <h3 className="category_name">{name}</h3>
            <p className="category_count">Аукционов: {count_of_active_auctions}</p>
            <Link to={`/auctions?category=${id}`}>Ебашь как не в себя</Link>
        </div>
    );
}

export default Category;