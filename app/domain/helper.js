module.exports = {
    calcPriceFirstOrder(totalPrice) {
        return totalPrice * 0.9
    },

    calcOriginalDiscount(product) {
        const frutifeiraFee = 0.02;
        product.price = product.price * (1 + frutifeiraFee);
        product.finalPrice = product.price * ( (100.0 - product.discount) / 100.0);
        return product;
    },

    newOrder(order, count) {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed);
        order.orderDate = today;
        order.orderNumber = count + 1;
        order.status = "Pendente";
    }
}