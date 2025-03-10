import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
    const cartUrl = "http://localhost:3000/cart";
    const token = localStorage.getItem("token");
    const [cart, setCart] = useState([]);
    const [id, setId] = useState('');
    const [cartEmpty, setCartEmpty] = useState(false);

    useEffect(() => {
        getAllCartProducts();
    }, []);

    const getAllCartProducts = () => {
        fetch(cartUrl + "/products", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
        .then((res) => {
            if (res.status === 404) {
                setCartEmpty(true); // Mark cart as empty
                setCart([]); // Clear the cart
                return null;
            }
            return res.json();
        })
        .then((res) => {
            if (res) {
                setId(res._id);
                setCart(res.products);
                setCartEmpty(res.products.length === 0); // Handle empty array case
            }
        })
        .catch((error) => console.error("Error fetching cart:", error));
    };

    const updateCart = (productId, quantity, stock) => {
        if (quantity < 1 || quantity > 10 || quantity > stock) {
            return;
        }
        const itemIndex = cart.findIndex(item => item._id === productId);
        console.log(productId)
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = quantity;
        }
        try {
            fetch(cartUrl + "/" + id, {
                method: 'PATCH',
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            }).then(res => res.json()).then(res => getAllCartProducts())
        } catch (error) {
            console.error("Error updating to cart", error);
        }
    }

    const removeProduct = (productId) => {
        fetch(cartUrl + "/" + id, {
            method: 'DELETE',
            body: JSON.stringify({
                productId: productId
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        }).then(res => res.json()).then(res => getAllCartProducts())
    }

    return (
        <div className="container cart-container">
            <div className="row">
            <div className="col-lg-8">
    <h4 className="mb-3">Shopping Cart</h4>

    {cartEmpty ? (
        <div className="text-center p-5">
            <svg width="150" height="150"><use xlinkHref="#cart"></use></svg>
            <h5 className="mt-3 text-muted">Your cart is empty!</h5>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/product" className="btn btn-primary mt-2">Go to Shop</Link>
        </div>
    ) : (
        cart.map((product, index) => (
            <div className="row cart-card d-flex align-items-center" key={index}>
                <div className="col-2 p-0">
                    <img src={product.product_id.image_url[0]} className="cart-img" alt="Product" />
                </div>

                <div className="col flex-grow-1">
                    <h6 className="mb-3">{product.product_id.product_name}</h6>
                    <div className="d-flex align-items-center">
                        <label htmlFor="quantity" className="me-2">Qty:</label>
                        <div className="input-group" style={{ width: "100px" }}>
                            <button className="btn border-dark-subtle px-2" type="button" onClick={() => {
                                updateCart(product._id, product.quantity - 1, product.product_id.product_stock);
                            }}>
                                <strong>-</strong>
                            </button>

                            <input
                                type="text"
                                name="quantity"
                                className="form-control text-center border-dark-subtle"
                                disabled
                                value={product.quantity}
                            />

                            <button className="btn border-dark-subtle px-2" type="button" onClick={() => {
                                updateCart(product._id, product.quantity + 1, product.product_id.product_stock);
                            }}>
                                <strong>+</strong>
                            </button>
                        </div>
                        <div className="ps-3" style={{ cursor: "pointer" }} onClick={() => {
                            removeProduct(product._id);
                        }}>
                            <svg width="22" height="22">
                                <use xlinkHref="#trash"></use>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="col-2">
                    <strong className="text-muted">₹{product.product_id.product_price * product.quantity}</strong>
                </div>
            </div>
        ))
    )}
</div>


                <div className="col-lg-4">
                    <h5 className="mb-3">Order Summary</h5>
                    <div className="cart-summary">
                        <p className="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <strong>₹{cart.reduce((total, p) => total + p.product_id.product_price * p.quantity, 0)}</strong>
                        </p>
                        <p className="d-flex justify-content-between">
                            <span>Total Items:</span>
                            <strong>{cart.reduce((total, p) => total + p.quantity, 0)}</strong>
                        </p>
                        <p className="d-flex justify-content-between">
                            <span>Shipping:</span>
                            <strong>Free</strong>
                        </p>
                        <hr />
                        <p className="d-flex justify-content-between">
                            <span>Total:</span>
                            <strong>₹{cart.reduce((total, p) => total + p.product_id.product_price * p.quantity, 0)}</strong>
                        </p>
                        <button className="btn btn-primary w-100 mt-3">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
