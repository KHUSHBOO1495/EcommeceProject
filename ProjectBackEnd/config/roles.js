const roles = {
    admin: ['getAllUser','getUserById','updateUser','deleteUser','getAllCategory','getCategoryById','updateCategory','deleteCategory','createCategory','getAllCart','getCartById','getProductFromCart','updateCartProduct','deleteProductFromCart','insertProductInCart','getAllProduct','getProductById','updateProduct','createProduct','deleteProduct','getAllFeedback','getAllFeedbackOfProduct','createFeedback','getFeedbackById','updateFeedback','deleteFeedback'],
    customer: ['getUserById','updateUser','deleteUser','getAllCategory','getCategoryById','getAllCart','getCartById','getProductFromCart','updateCartProduct','deleteProductFromCart','insertProductInCart','getAllProduct','getProductById','getAllFeedbackOfProduct','createFeedback','getFeedbackById','updateFeedback','deleteFeedback']
};

module.exports = roles;