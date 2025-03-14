import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function ProductDetail(){

    
  const productUrl = 'http://localhost:3000/product';
  const cartUrl = 'http://localhost:3000/cart';
  const token = localStorage.getItem('token')
    const [productDetail, setProductDetail] = useState({});
    const { id: productId } = useParams();

    useEffect(()=>{
        getProduct();
    },[])

    const getProduct = () => {
        fetch(productUrl+"/"+productId, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
        })
          .then(res => res.json())
          .then(res => setProductDetail(res))
      }

       const addToCart = async (id, quantity=1) => {
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

    return(
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
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next"
            >
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
                <h6 className="text-primary">{ productDetail?.product?.size }</h6>
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
            <button className="btn btn-warning" >
              Order Now
            </button>
          </div>
        </div>
      </div>

      <div className="my-5">
        <h4>Customer Feedback</h4>

        {/* Comment Box */}
        {/* <div className="mt-4">
          <h5>Leave a Feedback</h5>
          <form onSubmit={submitComment}>
            <div className="mb-3">
              <textarea
                value={newComment.text}
                onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                name="commentText"
                rows="4"
                className="form-control"
                placeholder="Write your feedback..."
                required
              />
            </div>
            <div className="d-flex gap-2">
              <label htmlFor="rating" className="form-label">
                Rating
              </label>
              <select
                value={newComment.rating}
                onChange={(e) => setNewComment({ ...newComment, rating: e.target.value })}
                name="rating"
                className="form-select"
                required
              >
                {[1, 2, 3, 4, 5].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </form>
        </div> */}
      </div>
    </div>
  );
};

export default ProductDetail;