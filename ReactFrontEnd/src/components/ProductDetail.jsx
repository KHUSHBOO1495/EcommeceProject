import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function ProductDetail() {
  const productUrl = 'http://localhost:3000/product';
  const cartUrl = 'http://localhost:3000/cart';
  const feedbackUrl = 'http://localhost:3000/feedback';
  const token = localStorage.getItem('token');
  const [productDetail, setProductDetail] = useState({});
  const [newComment, setNewComment] = useState({});
  const [feedback, setFeedback] = useState([]);
  const { id: productId } = useParams();

  useEffect(() => {
    getProduct();
    getFeedback();
  }, []);

  const getProduct = () => {
    fetch(productUrl + "/" + productId, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(res => setProductDetail(res));
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

  const submitComment = (e) => {
    e.preventDefault();

    // Post the feedback
    fetch(feedbackUrl + "/product/" + productId, {
      method: 'POST',
      body: JSON.stringify({
        rating: newComment.rating,
        comment: newComment.text
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(res => {
        // Clear the input fields after successful submission
        setNewComment({
          text: '',
          rating: ''
        });

        Swal.fire({
          title: 'Thank you for your feedback!',
          text: 'Your comment has been submitted successfully.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#f9f9f9',
          color: '#333',
          iconColor: '#4CAF50',
        });
      })
      .catch(error => {
        console.error('Error submitting comment:', error);
        Swal.fire({
          title: 'Error',
          text: 'There was an issue submitting your comment. Please try again later.',
          icon: 'error',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#f9f9f9',
          color: '#333',
          iconColor: '#FF6347',
        });
      });
  }

  const getFeedback = () => {
    fetch(feedbackUrl + "/product/" + productId, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.feedbacks) {
        setFeedback(res.feedbacks);
      } else {
        setFeedback([]);
      }
    })
  }

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Product Images Section */}
        <div className="col-md-4">
          <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {/* Loop over product images array */}
              {productDetail?.product?.image_url?.map((image, i) => (
                <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                  <img src={image} className="d-block w-100" alt="Product Image" />
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next" >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <h2>{productDetail?.product?.product_name}</h2>

          <div className="d-flex align-items-center">
            <del className="me-2">₹{productDetail?.original_price}</del>
            <h3 className="text-primary">₹{productDetail?.final_price}</h3>
          </div>

          <div className="d-flex align-items-center">
            <h6 className="me-2">Size:</h6>
            <h6 className="text-primary">{productDetail?.product?.size}</h6>
          </div>

          <div className="my-3">
            <span className="rating">
              {[1, 2, 3, 4, 5].map(star => {
                // Check if the star is full, half or empty based on the average rating
                if (star <= productDetail.average_rating) {
                  return (
                    <svg key={star} width="18" height="18" className="text-warning">
                      <use xlinkHref="#star-full"></use>
                    </svg>
                  );
                } else if (star - 1 < productDetail.average_rating) {
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
            <span className="ms-2">({productDetail?.total_ratings} reviews)</span>
          </div>
          <p>{productDetail?.description}</p>

          <div className="d-flex gap-3">
            <button className="btn btn-primary" onClick={() => addToCart(productDetail?.product?._id)}>
              Add to Cart
            </button>
            <button className="btn btn-warning">
              Order Now
            </button>
          </div>
        </div>
      </div>

      <div className="my-5">
        <h4>Customer Feedback</h4>

        {/* Comment Box */}
        <div className="mt-4">
          <h5>Leave a Feedback</h5>
          <form>
            <div className="mb-3">
              <textarea value={newComment.text} onChange={(e) => setNewComment({ ...newComment, text: e.target.value })} name="commentText" rows="4" className="form-control"  placeholder="Write your feedback..." required/>
            </div>
            <div className="d-flex gap-2">
              <label htmlFor="rating" className="form-label">
                Rating
              </label>
              <select value={newComment.rating} onChange={(e) => setNewComment({ ...newComment, rating: e.target.value })} name="rating" className="form-select" required>
                {[1, 2, 3, 4, 5].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-3" onClick={(e) => submitComment(e)}>
              Submit
            </button>
          </form>
        </div>

        <div className="mt-5">
          <h5>All Feedback</h5>
          {(feedback.length > 0) ? (
            feedback.map((feedbackItem) => (
              <div key={feedbackItem._id} className="mb-4 p-3 border rounded">
                <div className="d-flex align-items-center">
                {feedbackItem.user_id.profile_picture ? <img src={feedbackItem.user_id.profile_picture} style={{ borderRadius: "50%", objectFit: "cover" }} width="40" height="40"/> : <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"></path>
                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"></path>
                </svg>}
                <div className="ms-3">
                    <h6 className="mb-1">
                      {feedbackItem.user_id.first_name} {feedbackItem.user_id.last_name}
                    </h6>
                    <span className="text-muted">
                      {new Date(feedbackItem.commented_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="my-2">
                <span className="rating">
              {[1, 2, 3, 4, 5].map(star => {
                // Check if the star is full, half or empty based on the average rating
                if (star <= productDetail.average_rating) {
                  return (
                    <svg key={star} width="18" height="18" className="text-warning">
                      <use xlinkHref="#star-full"></use>
                    </svg>
                  );
                } else if (star - 1 < productDetail.average_rating) {
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
                </div>
                <p>{feedbackItem.comment}</p>
              </div>
            ))
          ) : (
            <p>No feedback available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
