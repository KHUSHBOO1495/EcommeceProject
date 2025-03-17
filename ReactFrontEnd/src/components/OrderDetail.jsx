import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderDetail() {

    const orderUrl = 'http://localhost:3000/order';
    const [order, setOrder] = useState({});
    const { id: orderId } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        getAllOrderById();
    }, []);

    const getAllOrderById = () => {
        fetch(orderUrl + "/" + orderId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        })
            .then((res) => res.json())
            .then(res => {
                setOrder(res);
            })
            .catch((error) => console.error("Error fetching order:", error));
    }

    return(
        <div class="container mt-5">
    <div class="card custom-card p-4">
        <h2 class="section-title">Order Details</h2>
        <hr />

        <div class="order-summary">
            <p><strong>Order Number:</strong> <span class="text-primary">{order?._id?.slice(-6).toUpperCase()}</span>
            </p>
            <p>
                                    <strong>Status: </strong>
                                    {order.order_status === "Cancelled" && (
                                        <span className="badge bg-danger">{order.order_status}</span>
                                    )}
                                    {order.order_status === "Delivered" && (
                                        <span className="badge bg-success">{order.order_status}</span>
                                    )}
                                    {order.order_status === "Pending" && (
                                        <span className="badge bg-warning">{order.order_status}</span>
                                    )}
                                    {order.order_status !== "Cancelled" &&
                                        order.order_status !== "Delivered" &&
                                        order.order_status !== "Pending" && (
                                            <span className="badge bg-secondary">{order.order_status}</span>
                                        )}
                                </p>
            <p><strong>Total Amount:</strong> <span class="text-success">₹{order?.total_amount }</span></p>
            <p><strong>Shipping Address:</strong> { order?.shipping_address }</p>
            <p><strong>Placed On:</strong> {new Date(order.placed_at).toLocaleDateString()}</p>
        </div>

        <h4 class="mt-4">Order Items</h4>
        <table class="table custom-table mt-3">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
            </thead>
            <tbody>
                {order?.order_items?.map((item, index) => (
                    <tr key={index}>

                        <td>{ item.product_id.product_name }</td>
                        <td>{ item.quantity }</td>
                        <td>₹{ item.product_id.product_price }</td>
                    </tr>
                ))}
                {/* <tr *ngFor="let item of order?.order_items">
                </tr> */}
            </tbody>
        </table>

        <div class="d-flex justify-content-between mt-4">
            <Link to="/order-history" class="btn btn-warning">Back to Orders</Link>
            {/* <a href="#" class="btn custom-btn-secondary">Track Order</a> */}
        </div>
    </div>
</div>
    )
}

export default OrderDetail;