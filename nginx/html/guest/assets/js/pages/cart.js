function Cart() {
    this.items = [];


    /**
     * Adds item to the cart
     * 
     * @param {string} itemId 
     */
    this.addItem = function (itemId) {
        let orderItem = this.items.find((orderItem) => orderItem.item === itemId);
        if (orderItem) {
            orderItem.quantity++;
        } else {
            orderItem = {
                item: itemId,
                quantity: 1,
            }
            this.items.push(orderItem);
        }

        return orderItem.quantity;
    }

    this.removeItem = function (itemId) {
        const orderItemIndex = this.items.findIndex((orderItem) => orderItem.item === itemId);
        let quantity = 0;
        if (orderItemIndex != -1) {
            const orderItem = this.items[orderItemIndex];
            if (orderItem.quantity === 1) {
                this.items.splice(orderItemIndex, 1);
            } else {
                orderItem.quantity--;
                quantity = orderItem.quantity;
            }
        }

        return quantity;
    }

    this.reset = function () {
        this.items = [];
    }

    this.isEmpty = function () {
        return this.items.length === 0;
    }

    this.getItems = function () {
        return this.items;
    }
}