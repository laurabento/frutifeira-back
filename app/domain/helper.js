module.exports = {
    calcPriceFirstOrder(totalPrice) {
        return totalPrice * 0.9
    },

    calcOriginalDiscount(product) {
        const frutifeiraFee = 0.02;
        product.finalPrice = (product.price * (1 - product.discount)) / (1 - frutifeiraFee);
        return product;
    }
}