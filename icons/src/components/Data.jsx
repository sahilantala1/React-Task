import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Data.module.css";

const Data = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setAllProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let sortedProducts = [...allProducts];

    if (sortBy === "lowToHigh") {
      sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
    }

    const filtered = sortedProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, sortBy]);

  const handleSort = (order) => {
    setSortBy(order);
  };

  return (
    <div className="blog-contain card text-center">
      <div className={`${styles.BackGround} ${styles.container} card-body`}>
        <h1 className={`${styles.heading}`}>PRODUCT LIST</h1>
        <input
          style={{ marginRight: 5, marginBottom: 5 }}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => handleSort("lowToHigh")}>Low to High</button>
        <button onClick={() => handleSort("highToLow")}>High to Low</button>
        <Link to={`/details/${user.id}`}>
          <div className={`row`}>
            {filteredProducts.map((user) => (
              <div
                key={user.id}
                className={`text-white col-4 position-relative ${styles.detailbox}`}
              >
                {user.images.length && (
                  <img
                    className={`${styles.imagetag} m-3`}
                    src={user.images[0] ?? user.images[0]}
                    alt="Product"
                  />
                )}
                <p>Name: {user.title}</p>
                <p>Description: {user.description}</p>
                <p>Price: ₹{user.price}</p>

                <button
                  className={`${styles.btnpos} btn btn-info position-absolute`}
                >
                  Details
                </button>
              </div>
            ))}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Data;
