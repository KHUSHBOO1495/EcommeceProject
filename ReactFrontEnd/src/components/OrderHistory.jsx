import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderHistory() {
    const orderUrl = 'http://localhost:3000/order';
    const [orderList, setOrderList] = useState([]);
    const [orderEmpty, setOrderEmpty] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        getAllOrder();
    }, []);

    const getAllOrder = () => {
        fetch(orderUrl + "/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((res) => {
                if (res.status === 404) {
                    setOrderEmpty(true);
                    setOrderList([]);
                    return null;
                }
                return res.json();
            })
            .then((res) => {
                if (res) {
                    setOrderList(res);
                    setOrderEmpty(res.length === 0);
                }
            })
            .catch((error) => console.error("Error fetching order:", error));
    };

    return (
        <div class="container order-container">
            <h2 class="text-center mb-4">Your Order History</h2>

            {orderEmpty ? (
                <div class="text-center p-5">
                    <svg width="150" height="150">
                        <use xlinkHref="#shopping-bag"></use>
                    </svg>
                    <h5 class="mt-3 text-muted">No Orders Yet!</h5>
                    <p>Looks like you haven't placed any orders yet.</p>
                    <Link to="/cart" class="btn btn-primary mt-2">Place Order</Link>
                </div>
            ) : (
                orderList.map((product, index) => (
                    <div class="order-item" key={index}>
                        <div class="row align-items-center">
                            <div class="col-md-8">
                                <h5>Order: {product._id.slice(-6).toUpperCase()}</h5>
                                <p><strong>Total:</strong> ₹{product.total_amount}</p>
                                <p>
                                    <strong>Status: </strong>
                                    {product.order_status === "Cancelled" && (
                                        <span className="badge bg-danger">{product.order_status}</span>
                                    )}
                                    {product.order_status === "Delivered" && (
                                        <span className="badge bg-success">{product.order_status}</span>
                                    )}
                                    {product.order_status === "Pending" && (
                                        <span className="badge bg-warning">{product.order_status}</span>
                                    )}
                                    {product.order_status !== "Cancelled" &&
                                        product.order_status !== "Delivered" &&
                                        product.order_status !== "Pending" && (
                                            <span className="badge bg-secondary">{product.order_status}</span>
                                        )}
                                </p>
                            </div>
                            <div class="col-md-4 text-end">
                                <p><strong>Date:</strong> {new Date(product.placed_at).toLocaleDateString()}</p>
                                <Link class="btn btn-primary" to={"/order-detail/" + product._id}>View Details</Link>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default OrderHistory;