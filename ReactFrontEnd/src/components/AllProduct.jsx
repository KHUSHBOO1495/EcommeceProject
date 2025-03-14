import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const AllProduct = () => {

  const productUrl = 'http://localhost:3000/product';
  const cartUrl = 'http://localhost:3000/cart';
  const wishlistUrl = 'http://localhost:3000/wishlist';
  const token = localStorage.getItem('token')
  const [product, setProduct] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlistProductIds, setWishlistProductIds] = useState([]);
  const [minPrice, setMinPrice] = useState(2000);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
  const [sortBy, setSortBy] = useState('none');
  const { id: categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || token === 'undefined') {
      navigate('/login')
    }
    loadWishlist();
    categoryId ? getProductsByCategory(categoryId) : getAllProducts();

  }, [categoryId])

  const loadWishlist = async () => {
    try {
      fetch(wishlistUrl + "/products", {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.products) {
            setWishlistProductIds(res.products.map((p) => p.product_id._id));
          }
        })
    } catch (error) {
      console.error("Error loading wishlist", error);
    }
  };

  const isInWishlist = (id) => wishlistProductIds.includes(id);

  const addToWishlist = async (id) => {
    try {
      fetch(wishlistUrl, {
        method: 'POST',
        body: JSON.stringify({
          productId: id
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      })
        .then(res => res.json())
        .then(res => {
          setWishlistProductIds((prev) =>
            res.status ? [...prev, id] : prev.filter((pid) => pid !== id)
          );
          Swal.fire({
            title: res.message,
            text: "Your wishlist has been updated successfully.",
            icon: res.status ? "success" : "info",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            background: "#f9f9f9",
            color: "#333",
            iconColor: res.status ? "#4CAF50" : "#FFA500",
          });
        });
    } catch (error) {
      console.error("Error updating wishlist", error);
    }
  };

  const getAllProducts = () => {
    fetch(productUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(res => {
        setProduct(res);
        setFilteredProducts(res);  // Set filteredProducts with all products initially
      })
  }

  const getProductsByCategory = (categoryId) => {
    fetch(productUrl, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(res => {
        const categoryProducts = res.filter((product) => product.category_id === categoryId);
        setProduct(categoryProducts);
        setFilteredProducts(categoryProducts); // Filter products by category
      })
  }

  const addToCart = async (id, quantity = 1) => {
    try {
      fetch(cartUrl, {
        method: 'POST',
        body: JSON.stringify({
          productId: id,
          quantity: quantity
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        }
      })
        .then(res => res.json())
        .then(res => {
          Swal.fire({
            title: "Product Added to Cart!",
            text: "Your item has been added successfully.",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            background: "#f9f9f9",
            color: "#333",
            iconColor: "#4CAF50",
          });
        });
    } catch (error) {
      console.error("Error adding to cart", error);
    }
  };

  const applyFilters = () => {
    const filtered = product.filter(
      (product) =>
        product.final_price >= minPrice &&
        product.final_price <= maxPrice
    );

    applySorting(filtered);
  };

  const applySorting = (productsToSort) => {
    let sorted = [...productsToSort];
    switch (sortBy) {
      case 'price_low':
        sorted.sort((a, b) => a.final_price - b.final_price);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.final_price - a.final_price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'stock':
        sorted.sort((a, b) => b.product_stock - a.product_stock);
        break;
      default:
        break;
    }
    setFilteredProducts(sorted);
  };

  const handlePriceChange = (e) => {
    const newMaxPrice = e.target.value;
    setMaxPrice(newMaxPrice);  // Update maxPrice state with new value
    applyFilters();  // Re-apply the filter after price change
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md p-3 bg-light">
          <h4>Filters</h4>
          <div className="form-group mt-3">
            <label className="fw-bold">Price Range</label>
            <input
              type="range"
              className="form-range"
              min={2000}
              max={maxPriceLimit}
              value={maxPrice}
              onChange={handlePriceChange}  // Handle price change event
              onMouseUp={applyFilters}  // Optional: Apply filter on mouse up
            />
            <span className="text-primary">Up to ₹{maxPrice}</span>
          </div>
          <div className="form-group mt-3">
            <label className="fw-bold">Sort By</label>
            <select
              className="form-control border-primary"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              onBlur={() => applySorting(filteredProducts)}
            >
              <option value="none">None</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="stock">Stock</option>
            </select>
          </div>
        </div>
        <div className="col-md-10">
          <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">
            {filteredProducts.map((product, index) => (
              <div className="col" key={index}>
                <div className="product-item">
                  <figure>
                    <Link to={"/product/" + product._id} title="Product Title">
                      <img src={product.image_url[0]} alt="Product Thumbnail" className="tab-image" />
                    </Link>
                  </figure>
                  <div className="d-flex flex-column text-center">
                    <h3 className="fs-6 fw-normal">{product.product_name}</h3>
                    <div>
                      <span className="rating">
                        {[1, 2, 3, 4, 5].map(star => {
                          if (star <= product.average_rating) {
                            return (
                              <svg key={star} width="18" height="18" className="text-warning">
                                <use xlinkHref="#star-full"></use>
                              </svg>
                            );
                          } else if (star - 1 < product.average_rating) {
                            return (
                              <svg key={star} width="18" height="18" className="text-warning">
                                <use xlinkHref="#star-half"></use>
                              </svg>
                            );
                          } else {
                            return (
                              <svg key={star} width="18" height="18" className="text-muted">
                                <use xlinkHref="#star-empty"></use>
                              </svg>
                            );
                          }
                        })}
                      </span>
                      <span>({product.total_ratings})</span>
                    </div>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <del>₹{product.original_price}</del>
                      <span className="text-dark fw-semibold">₹{product.final_price}</span>
                      <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">
                        10% OFF
                      </span>
                    </div>
                    <div className="button-area p-3 pt-0">
                      <div className="row g-1 mt-2">
                        <div className="col">
                          <button
                            className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"
                            onClick={() => addToCart(product._id)}>
                            <svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart
                          </button>
                        </div>
                        <div className="col-2 p-2">
                          {isInWishlist(product._id) ? (
                            <a className="wishlist-btn" onClick={() => addToWishlist(product._id)} style={{ cursor: "pointer" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"></path>
                              </svg>
                            </a>
                          ) : (
                            <a className="wishlist-btn" onClick={() => addToWishlist(product._id)} style={{ cursor: "pointer" }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"></path>
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProduct;
