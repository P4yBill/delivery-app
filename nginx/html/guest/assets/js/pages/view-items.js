let cart = new Cart();

const itemsContainer = document.querySelector('.items-container');
const loadingImg = document.querySelector('.loadingImg');
const errorContainer = document.querySelector('.error-container');
const currencySelect = document.getElementById('currency-select');

$(document).ready(function () {
    loadItems();
});

let targetCurrency = 'EUR';

function loadItems() {
    itemsContainer.innerHTML = '';
    cart.reset();
    getItems();
}

function showLoader() {
    $(loadingImg).show();
    $(itemsContainer).hide();
    $(errorContainer).hide();
}

function showItemsContainer() {
    $(itemsContainer).show();
    $(loadingImg).hide();
    $(errorContainer).hide();
}

function showErrorContainer() {
    $(errorContainer).show();
    $(loadingImg).hide();
    $(itemsContainer).hide();
}

function getItems() {
    showLoader();
    const selectedCurrency = currencySelect.value;
    ItemsApiContainer
        .getItems({ currency: selectedCurrency }).then((res) => {
            if (res.data?.success) {
                const currency = res.data.target_currency ? res.data.target_currency : 'EUR';
                const currencyRate = res.data.currency_rate ? res.data.currency_rate : 1;
                res.data.data.forEach((item) => {
                    const elementHtml = createItem(item, currency, currencyRate);
                    itemsContainer.insertAdjacentHTML('beforeend', elementHtml);
                });
                showItemsContainer();
            } else {
                throw new Error(res.data?.message || 'Something went wrong');
            }

        }).catch((e) => {
            showErrorContainer();
        });
}

function submitOrder() {
    const errorOrderContainer = document.querySelector('.error-container-order');
    if (cart.isEmpty()) {
        errorOrderContainer.innerHTML = 'Cart is empty';
        return;
    }
    const selectedCurrency = currencySelect.value;
    const userEmail = document.getElementById('emailAddressInput').value;

    const payload = {
        userEmail: userEmail,
        targetCurrency: selectedCurrency,
        items: cart.getItems(),
    };

    OrderApiContainer.create(payload).then((res) => {
        if (res.data?.success) {
            errorOrderContainer.innerHTML = 'Order submitted successfully';
        } else {
            const message = res.data?.message || 'Something went wrong';
            errorOrderContainer.innerHTML = message;
            $(errorOrderContainer).show();
        }

    }).catch((axiosError) => {
        const message = axiosError.response?.data?.message || 'Something went wrong. Please try again'
        errorOrderContainer.innerHTML = message;
    });
}

function addHandler(event) {
    const addButton = $(event.target);
    const itemId = addButton.attr("data-id");

    const quantity = cart.addItem(itemId);

    updateQuantity(addButton.closest('.card-body')[0], quantity);
    if (quantity == 1) {
        const removeBut = addButton.siblings('.remove-btn');
        $(removeBut).show();
    }
}

function removeHandler(event) {
    const removeBut = $(event.target);
    const itemId = removeBut.attr("data-id");

    const quantity = cart.removeItem(itemId);
    if (quantity == 0) {
        removeBut.hide();
    }

    updateQuantity(removeBut.closest('.card-body')[0], quantity);
}


function updateQuantity(card, quantity) {
    const quantityEl = card.querySelector('.item-quantity');
    quantityEl.innerHTML = quantity;
    if (cart.getItems().length === 1) {
        $('.order-container').show();
    } else if (cart.getItems().length === 0) {
        $('.order-container').hide();
    }

}

/**
 * Returns item template
 * @param {Object} item - The employee who is responsible for the project.
 * @returns {string} String containing item template
 */
function createItem(item, currency, currencyRate) {
    const itemElement = `<div class="card" style="width: 18rem;">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">Cost: ${item.cost * currencyRate} ${currency}</h6>
                <p class="card-text">${item.description}</p>
                <p class="card-text"><span>Category: </span><span>${item.category.name}</span></p>
                <p class="card-text"><span><strong>Cart quantity: </strong></span><span class="item-quantity">0</span></p>
                <div class="button-wrapper">
                    <button class="btn btn-primary add-btn" data-id="${item._id}" onclick="addHandler(event)">Add</button>
                    <button class="btn btn-danger remove-btn" data-id="${item._id}" onclick="removeHandler(event)">Remove</button>
                </div>
            </div>
        </div>`;
    return itemElement;
}