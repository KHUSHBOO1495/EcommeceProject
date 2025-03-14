import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Wishlist() {
    const productUrl = 'http://localhost:3000/product';
    const wishlistUrl = "http://localhost:3000/wishlist";
    const cartUrl = 'http://localhost:3000/cart';
    const token = localStorage.getItem("token");
    const [wishlist, setWishlist] = useState([]);
    const [wishlistEmpty, setWishlistEmpty] = useState(false);
    const [suggestProducts, setSuggestProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || token === 'undefined') {
            navigate('/login');
        }
        getAllWishlistProducts();
    }, []);

    useEffect(() => {
        if (wishlist.length > 0) {
            getAllProducts();
        }
    }, [wishlist]);

    const getAllWishlistProducts = () => {
        fetch(wishlistUrl + "/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((res) => {
                if (res.status === 404) {
                    setWishlistEmpty(true);
                    setWishlist([]);
                    return null;
                }
                return res.json();
            })
            .then((res) => {
                if (res) {
                    setWishlist(res.products);
                    setWishlistEmpty(res.products.length === 0);
                }
            })
            .catch((error) => console.error("Error fetching wishlist:", error));
    };

    const removeFromWishlist = (id) => {
        fetch(wishlistUrl, {
            method: 'POST',
            body: JSON.stringify({
                productId: id,
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(() => {
                setWishlist(wishlist.filter(item => item.product_id._id !== id));
            })
            .catch((error) => console.error("Error removing from wishlist:", error));
    };

    const addToWishlist = async (id) => {
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
                getAllWishlistProducts();
            })
            .catch((error) => console.error("Error adding to wishlist:", error));
    };

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
                .then(() => {
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
                const wishlistCategoryIds = wishlist.map(item => item.product_id.category_id);
                const wishlistProductIds = wishlist.map(item => item.product_id._id);

                setSuggestProducts(res
                    .filter((p) =>
                        p.product_stock > 2 &&
                        p.average_rating >= 4 &&
                        wishlistCategoryIds.includes(p.category_id) &&
                        !wishlistProductIds.includes(p._id)
                    )
                    .slice(0, 3));
            })
            .catch((error) => console.error("Error fetching products:", error));
    };


    return (
        <div className="container wishlist-container">
            <div className="row">
                <div className="col-lg-8">
                    <h4 className="mb-3">Your Wishlist</h4>
                    {wishlistEmpty ? (
                        <div className="text-center p-5">
                            <svg width="150" height="150"><use xlinkHref="#wishlist"></use></svg>
                            <h5 className="mt-3 text-muted">Your wishlist is empty!</h5>
                            <p>Start adding your favorite items now.</p>
                            <Link to="/product" className="btn btn-primary mt-2">Go to Shop</Link>
                        </div>
                    ) : (
                        wishlist.map((product, index) => (
                            <div className="row wishlist-card d-flex align-items-center" key={index}>
                                <div className="col-2 p-0">
                                    <Link to={"/product/" + product.product_id._id}>
                                        <img src={product.product_id.image_url[0]} className="wishlist-img" alt="Product Image" />
                                    </Link>
                                </div>
                                <div className="col flex-grow-1 m-3">
                                    <h6 className="">{product.product_id.product_name}</h6>
                                    <div className="d-flex">
                                        <p className="text-muted pe-2">₹{product.product_id.product_price}</p>
                                        {product.product_id.product_stock > 0 ? (
                                            <p className="text-success">In Stock</p>
                                        ) : (
                                            <p className="text-danger">Out of Stock</p>
                                        )}
                                    </div>

                                    <div className="d-flex">
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => addToCart(product.product_id._id)}
                                            disabled={product.product_id.product_stock <= 0} >
                                            Move to Cart
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => removeFromWishlist(product.product_id._id)} >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="col-lg-4">
                    <h5 className="mb-3">You May Also Like</h5>
                    {suggestProducts.map((product, index) => {
                        return (
                            <div className="recommended-product d-flex align-items-center mb-3" key={index}>
                                <Link to={"/product/" + product._id}>
                                    <img
                                        src={product.image_url[0]} className="me-3 rounded wishlist-img" alt="Recommended Product" style={{ cursor: "pointer" }} />
                                </Link>
                                <div>
                                    <h6 className="mb-1">{product.product_name}</h6>
                                    <p className="text-muted mb-1">₹{product.final_price}</p>
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => addToWishlist(product._id)}>
                                        Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Wishlist;