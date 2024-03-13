import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Data.module.css";

const Data = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [loading, setLoading] = useState(false); // State to track loading for initial data
  const [loadingMore, setLoadingMore] = useState(false); // State to track loading for next 30 data
  const listInnerRef = useRef();
  const pageRef = useRef(1); // Ref to track current page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true when fetching initial data
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setAllProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); // Set loading to false when initial data fetching is completed
      }
    };

    fetchData();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    let sortedProducts = [...allProducts];

    if (sortOption === "lowToHigh") {
      sortedProducts = sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      sortedProducts = sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "AtoZ") {
      sortedProducts = sortedProducts.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (sortOption === "ZtoA") {
      sortedProducts = sortedProducts.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    const filtered = sortedProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, sortOption]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    console.log("call");
    console.log(
      Math.ceil(window.innerHeight + document.documentElement.scrollTop),
      document.documentElement.offsetHeight
    );
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) ===
      document.documentElement.offsetHeight
    ) {
      console.log("Fetch more list items!");
      fetchMoreItems();
    }
  };

  const fetchMoreItems = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const skip = allProducts.length;
      const response = await fetch(
        `https://dummyjson.com/products?page=${nextPage}&limit=30&skip=${skip}`
      );
      const data = await response.json();
      setAllProducts((prevProducts) => [...prevProducts, ...data.products]);
      setFilteredProducts((prevProducts) => [
        ...prevProducts,
        ...data.products,
      ]);
      pageRef.current = nextPage;
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
      <div className="blog-contain card text-center">
        <div className={`${styles.BackGround} ${styles.container} card-body`}>
          <h1 className={`${styles.heading}`}>PRODUCT LIST</h1>
          <input
            style={{ marginRight: 5, marginBottom: 5 }}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={sortOption} onChange={handleSortChange}>
            <option value="default">Select Sorting Option</option>
            <option value="lowToHigh">Price Low to High</option>
            <option value="highToLow">Price High to Low</option>
            <option value="AtoZ"> Sorting A-Z</option>
            <option value="ZtoA"> Sorting Z-A</option>
          </select>
          <div className={`row`} ref={listInnerRef}>
            {filteredProducts.map((product) => (
              <Link
                to={`/details/${product.id}`}
                key={product.id}
                className="col-4 text-decoration-none"
              >
                <div
                  className={`text-white position-relative ${styles.detailbox}`}
                >
                  {product.images && product.images.length > 0 && (
                    <img
                      className={`${styles.imagetag} m-3`}
                      src={product.images[0] ?? product.images[0]}
                      alt="Product"
                    />
                  )}
                  <h3>{product.title}</h3>
                  <h4>Price: ₹{product.price}</h4>
                </div>
              </Link>
            ))}
          </div>
          {loadingMore && <div>Loading more...</div>}{" "}
        </div>
      </div>
    </>
  );
};

export default Data;
