import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Cart() {
    const cartUrl = "http://localhost:3000/cart";
    const paymentUrl = 'http://localhost:3000/payment';
    const orderUrl = 'http://localhost:3000/order';
    const token = localStorage.getItem("token");
    const [cart, setCart] = useState([]);
    const [cartEmpty, setCartEmpty] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [id, setId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || token === 'undefined') {
            navigate('/login')
        }
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

    const toggleAddressForm = () => {
        setShowAddressForm(!showAddressForm);
    }
    
    const showPaymentOptions = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Select Payment Method',
            text: 'Choose how you want to pay for your order.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Pay with Razorpay',
            cancelButtonText: 'Cash on Delivery (COD)',
            confirmButtonColor: '#007bff', // Blue for Razorpay
            cancelButtonColor: '#28a745', // Green for COD
            background: '#f9f9f9',
            color: '#333'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(orderUrl + "/cart", {
                    method: 'POST',
                    body: JSON.stringify({
                        shipping_address: shippingAddress
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                })
                .then(res => res.json())
                .then(res => {
                    getAllCartProducts();
                    payWithRazorpay(res.order._id, res.order.total_amount);
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                fetch(orderUrl + "/cart", {
                    method: 'POST',
                    body: JSON.stringify({
                        shipping_address: shippingAddress
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    }
                })
                .then(res => res.json())
                .then(res => {
                    getAllCartProducts();
                    payWithCOD(res.order._id);
                });
            }
        });
    }

    const payWithCOD = (orderId) => {
        fetch(paymentUrl + "/cod", {
            method: 'POST',
            body: JSON.stringify({
                order_id: orderId
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(res => {
                Swal.fire({
                    title: 'COD Selected',
                    text: 'Your order has been placed successfully. Pay upon delivery.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#4CAF50'
                }).then(() => {
                    navigate('/order-history');
                });
            })
    }

    const payWithRazorpay = (orderId, orderAmount) => {
        const RazorPayOptions = {
            description: 'Sample Demo',
            currency: 'INR',
            amount: orderAmount * 100,
            name: "Vintage Vastra",
            key: 'rzp_test_LEMyImcFyWSHFZ', // Use test key
            // image: 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
            prefill: {
                name: 'abc',
                email: 'abc@gmail.com',
                phone: '1234567890',
            },
            theme: {
                color: '#c9184a'
            },
            method: {  // Force enable UPI
                upi: true,
                card: true,
                netbanking: true,
                wallet: true,
            },
            handler: (res) => {
                verifyPayment(orderId, res.razorpay_payment_id);
            },
            modal: {
                ondismiss: () => {
                    console.log('Payment Cancelled');
                }
            }
        };

        const successCallBack = (paymentId) => {
            console.log('Payment Success:', paymentId);
        };

        const failureCallBack = (error) => {
            console.log('Payment Failed:', error);
        };

        Razorpay.open(RazorPayOptions, successCallBack, failureCallBack);
    }

    const verifyPayment = (orderId, payment_id) => {
        fetch(paymentUrl + "/razorpay", {
            method: 'POST',
            body: JSON.stringify({
                order_id: orderId,
                payment_id: payment_id
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(res => {
                Swal.fire({
                    title: 'Payment Successful!',
                    text: 'Your order has been confirmed.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#4CAF50'
                }).then(() => {
                    navigate('/order-history');
                });
            }, (error) => {
                Swal.fire({
                    title: 'Payment Failed!',
                    text: 'Something went wrong. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'Retry'
                });
            })
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
                                    <Link to={"/product/" + product.product_id._id}>
                                        <img src={product.product_id.image_url[0]} className="cart-img" alt="Product" />
                                    </Link>
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
                        {!showAddressForm && (
                            <button className="btn btn-primary w-100 mt-3" onClick={toggleAddressForm} >
                                Proceed to Checkout
                            </button>
                        )}

                        {showAddressForm && (
                            <form>
                                <h5 className="mt-3">Shipping Address</h5>

                                <div className="mb-2">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <textarea id="address" className="form-control" name="address" required
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)} />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 mt-2" onClick={(e) => showPaymentOptions(e)}>Place Order</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
