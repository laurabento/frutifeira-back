module.exports = {
    calcPriceFirstOrder(totalPrice) {
        return totalPrice * 0.9
    },

    calcOriginalDiscount(product) {
        if (product.type == 'Fruta') {
            product.originalDiscount = 0.02;
        } else if (product.type == 'Verdura') {
            product.originalDiscount = 0.05;
        }
        product.oldPrice = product.price / (1 - product.originalDiscount);
        return product;
    }
}