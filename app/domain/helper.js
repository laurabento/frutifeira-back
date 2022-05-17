module.exports = {
    calcPriceFirstOrder(totalPrice) {
        return totalPrice * 0.9
    },

    calcOriginalDiscount(type) {
        var discount = 0;
        if (type == 'Fruta') {
            discount = 0.02;
        } else if (type == 'Verdura') {
            discount = 0.05;
        }
        return discount;
    }
}