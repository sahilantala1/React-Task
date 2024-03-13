import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Data.module.css";

const Data = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const listInnerRef = useRef();
  const pageRef = useRef(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setAllProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(parseFloat(e.target.value));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
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

    let filtered = sortedProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered = filtered.filter(
      (product) =>
        product.price <= maxPrice &&
        (selectedCategory === "All" || product.category === selectedCategory)
    );

    setFilteredProducts(filtered);
  }, [allProducts, searchTerm, sortOption, maxPrice, selectedCategory]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) ===
      document.documentElement.offsetHeight
    ) {
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
            placeholder="Search by title..."
          />
          <select value={sortOption} onChange={handleSortChange}>
            <option value="default">Select Sorting Option</option>
            <option value="lowToHigh">Price Low to High</option>
            <option value="highToLow">Price High to Low</option>
            <option value="AtoZ">Sorting A-Z</option>
            <option value="ZtoA">Sorting Z-A</option>
          </select>

          <label>
            Max Price:{" "}
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              placeholder="Enter max price..."
            />
          </label>

          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="All">All Categories</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="fragrances">Fragrances</option>
            <option value="skincare">Skincare</option>
            <option value="groceries">Groceries</option>
            <option value="home-decoration">Home-Decoration</option>
            <option value="furniture">Furniture</option>
            <option value="tops">Tops</option>
            <option value="womens-dresses">womens-dresses</option>
            <option value="mens-shirts">mens-shirts</option>
            <option value="mens-shoes">mens-shoes</option>
            {/* Add other categories as needed */}
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
                  <h5>Category : {product.category}</h5>
                </div>
              </Link>
            ))}
          </div>
          {loadingMore && <div>Loading more...</div>}
        </div>
      </div>
    </>
  );
};

export default Data;
