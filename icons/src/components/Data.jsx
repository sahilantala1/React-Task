import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Data.module.css";

export const Data = () => {
  const [selectedProduct, setSelectedProduct] = useState([]);

  fetch(`https://dummyjson.com/products`)
    .then((res) => res.json())
    .then((data) => {
      setSelectedProduct(data.products);
    })
    .catch((error) => console.log(error));

  return (
    <div className="blog-contain card text-center">
      <div className={`${styles.BackGround} ${styles.container} card-body`}>
        <h1 className={`${styles.heading}`}>PRODUCT LIST</h1>

        <div className={`row`}>
          {selectedProduct.map((user) => (
            <div
              key={user.id}
              className={`text-white col-4 position-relative ${styles.detailbox}`}
            >
              {user.images.length && (
                <Link to={`/details/${user.id}`}>
                  <img
                    className={`${styles.imagetag} m-3`}
                    src={user.images[0] ?? user.images[0]}
                    alt="Product"
                  />
                </Link>
              )}
              <p>Name: {user.title}</p>
              <p>Description: {user.description}</p>
              <p>Price: {user.price}</p>
              <p>Discount: {user.discountPercentage}</p>
              <p>Rating: {user.rating}</p>
              <p>Stock: {user.stock}</p>
              <p>Brand: {user.brand}</p>
              <p>Category: {user.category}</p>
              <Link to={`/details/${user.id}`}>
                <button
                  className={`${styles.btnpos} btn btn-info position-absolute`}
                >
                  Details
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Data;
