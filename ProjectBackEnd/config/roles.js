const roles = {
    admin: ['getAllUser','getUserById','updateUser','deleteUser','getAllCategory','getCategoryById','updateCategory','deleteCategory','createCategory','getAllCart','getCartById','getProductFromCart','updateCartProduct','deleteProductFromCart','insertProductInCart'],
    customer: ['updateUser','deleteUser','getAllCategory','getCategoryById','getAllCart','getCartById','getProductFromCart','updateCartProduct','deleteProductFromCart','insertProductInCart']
};

module.exports = roles;