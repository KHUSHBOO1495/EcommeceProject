const roles = {
    admin: ['getAllUser','getUserById','updateUser','deleteUser','getAllCategory','getCategoryById','updateCategory','deleteCategory','createCategory','getAllCart','getCartById','getProductFromCart','updateCartProduct','deleteProductFromCart','insertProductInCart','getAllProduct','getProductById','updateProduct','createProduct','deleteProduct','getAllFeedback','getAllFeedbackOfProduct','createFeedback','getFeedbackById','updateFeedback','deleteFeedback','getAllWishlist','getWishlistById','getProductFromWishlist','updateWishlistProduct','deleteProductFromWishlist','insertProductInWishlist','getAllDiscount','getDiscountById','getAllActiveDiscount','createDiscount','updateDiscount','deleteDiscount','getAllCoupon','getAllActiveCoupon','createCoupon','updateCoupon','deleteCoupon','getAllOrder','createOrder','getOrderById','updateOrderStatus','getAllOrderOfUser','softDeleteOrder'],
    customer: ['getUserById','updateUser','deleteUser','getAllCategory','getCategoryById','getCartById','getProductFromCart','updateCartProduct','deleteProductFromCart','insertProductInCart','getAllProduct','getProductById','getAllFeedbackOfProduct','createFeedback','getFeedbackById','updateFeedback','deleteFeedback','getWishlistById','getProductFromWishlist','updateWishlistProduct','deleteProductFromWishlist','insertProductInWishlist','createOrder','getOrderById','getAllOrderOfUser','softDeleteOrder']
};

module.exports = roles;