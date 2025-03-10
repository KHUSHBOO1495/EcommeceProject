import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Featured() {

    const productUrl = 'http://localhost:3000/product';
    const cartUrl = 'http://localhost:3000/cart';
    const wishlistUrl = 'http://localhost:3000/wishlist';
    const token = localStorage.getItem('token')
    const [product, setProduct] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [wishlistProductIds, setWishlistProductIds] = useState([]);

    useEffect(() => {
        getAllProducts();

        loadWishlist();
    }, [])

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
                const filteredProducts = res.filter(p => p.product_stock > 2 && p.average_rating >= 4.5);
                setProduct(filteredProducts);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

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
                })
            // await axios.post("/api/cart", { productId: id, quantity });

        } catch (error) {
            console.error("Error updating wishlist", error);
        }



    };

    const addToCart = async (id, quantity) => {
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
                })
            // await axios.post("/api/cart", { productId: id, quantity });

        } catch (error) {
            console.error("Error adding to cart", error);
        }
    };

    return (
        <div className="swiper-wrapper">
            {product.map((product,index)=>{
                return(
                    <div className="product-item swiper-slide" key={index}>
                <figure>
                    <a href="/" title="Product Title">
                        <img src={product.image_url[0]} alt="Product Thumbnail" className="tab-image" />
                    </a>
                </figure>
                <div className="d-flex flex-column text-center">
                    <h3 className="fs-6 fw-normal">{product.product_name}</h3>
                    <div>
                        <span className="rating">
                            {[1, 2, 3, 4, 5].map(star => {
                                // Check if the star is full, half or empty based on the average rating
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
                            <div className="col-3">
                                <input
                                    type="number"
                                    className="form-control border-dark-subtle input-number quantity"
                                    value={quantities[product._id] || 1}
                                    onChange={(e) => setQuantities({ ...quantities, [product._id]: e.target.value })}
                                />
                            </div>
                            <div className="col">
                                <button
                                    className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"
                                    onClick={() => addToCart(product._id, quantities[product._id] || 1)}>
                                    <svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart
                                </button>
                            </div>
                            <div className="col-2 p-2">
                                {isInWishlist(product._id) ? (
                                    <a className="wishlist-btn" onClick={() => addToWishlist(product._id)} style={{ cursor: "pointer" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red"
                                            class="bi bi-heart-fill" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314">
                                            </path>
                                        </svg>
                                    </a>
                                ) : (
                                    <a className="wishlist-btn" onClick={() => addToWishlist(product._id)} style={{ cursor: "pointer" }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                            <path
                                                d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15">
                                            </path>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                )
            })}

            {/* <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-10.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Greek Style Plain Yogurt</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-11.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Pure Squeezed No Pulp Orange Juice</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-12.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Fresh Oranges</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-13.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Gourmet Dark Chocolate Bars</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-14.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Fresh Green Celery</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-15.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Sandwich Bread</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-16.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Honeycrisp Apples</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-17.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Whole Wheat Sandwich Bread</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product-item swiper-slide">
                                    <figure>
                                        <a href="index.html" title="Product Title">
                                            <img src="images/product-thumb-18.png" alt="Product Thumbnail" className="tab-image" />
                                        </a>
                                    </figure>
                                    <div className="d-flex flex-column text-center">
                                        <h3 className="fs-6 fw-normal">Honeycrisp Apples</h3>
                                        <div>
                                            <span className="rating">
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-full"></use></svg>
                                                <svg width="18" height="18" className="text-warning"><use xlinkHref="#star-half"></use></svg>
                                            </span>
                                            <span>(222)</span>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-2">
                                            <del>$24.00</del>
                                            <span className="text-dark fw-semibold">$18.00</span>
                                            <span className="badge border border-dark-subtle rounded-0 fw-normal px-1 fs-7 lh-1 text-body-tertiary">10% OFF</span>
                                        </div>
                                        <div className="button-area p-3 pt-0">
                                            <div className="row g-1 mt-2">
                                                <div className="col-3"><input type="number" name="quantity" className="form-control border-dark-subtle input-number quantity" defaultValue="1" /></div>
                                                <div className="col-7"><a href="#" className="btn btn-primary rounded-1 p-2 fs-7 btn-cart"><svg width="18" height="18"><use xlinkHref="#cart"></use></svg> Add to Cart</a></div>
                                                <div className="col-2"><a href="#" className="btn btn-outline-dark rounded-1 p-2 fs-6"><svg width="18" height="18"><use xlinkHref="#heart"></use></svg></a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}


        </div>
    )

}

export default Featured;