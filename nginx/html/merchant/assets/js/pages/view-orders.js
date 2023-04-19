const ordersContainer = document.querySelector('.orders-container');
const loadingImg = document.querySelector('.loadingImg');
const errorContainer = document.querySelector('.error-container');
const loginContainer = document.querySelector('.login-container');

$(document).ready(function () {
    loadOrders();
});

let targetCurrency = 'EUR';

function loadOrders() {
    ordersContainer.innerHTML = '';

    if (localStorage.getItem('token')) {
        getOrders();
    } else {
        showLoginContainer();
    }
}

function showLoader() {
    $(loadingImg).show();
    $(ordersContainer).hide();
    $(errorContainer).hide();
    $(loginContainer).hide();

}

function showOrdersContainer() {
    $(ordersContainer).show();
    $(loadingImg).hide();
    $(errorContainer).hide();
    $(loginContainer).hide();

}

function showErrorContainer() {
    $(errorContainer).show();
    $(loadingImg).hide();
    $(ordersContainer).hide();
    $(loginContainer).hide();
}

function showLoginContainer() {
    $(loginContainer).show();
    $(loadingImg).hide();
    $(ordersContainer).hide();
    $(errorContainer).hide();
}

function getOrders() {
    showLoader();

    OrderApiContainer
        .get().then((res) => {
            if (res.data?.success) {
                res.data.data.forEach((order) => {
                    const elementHtml = createOrder(order);
                    ordersContainer.insertAdjacentHTML('beforeend', elementHtml);
                });
                showOrdersContainer();
            } else {
                throw new Error(res.data?.message || 'Something went wrong');
            }
        }).catch((e) => {
            if (e?.response?.data?.error === 'jwt') {
                localStorage.removeItem('token');
                showLoginContainer();
            }

            errorContainer.innerHTML = 'Something went wrong. Please reload the page';
            showErrorContainer();
        });
}

/**
 * Returns item template
 * @param {Object} order - The employee who is responsible for the project.
 * @returns {string} String containing item template
 */
function createOrder(order) {
    let orderItemsContent = '';
    order.items.forEach((orderItem) => {
        orderItemsContent += getOrderItemElement(orderItem, order.currency_rate, order.target_currency);
    });
    const currencyElements = getCurrencyElements(order);
    const orderElement = `<div class="card">
    <div class="card-header">
        Order id: <span class="order-id">${order._id}</span>
    </div>
    <div class="card-body">
        <div class="row mb-3">
            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Status</label>
            <div class="col-sm-10">
                <span class="order-status">${order.status}</span>
            </div>
        </div>
        <div class="row mb-3">
            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">User email</label>
            <div class="col-sm-10">
                <span class="order-user-email">${order.user_email}</span>
            </div>
        </div>
        ${currencyElements}
        <div class="row mb-3">
            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Created at</label>
            <div class="col-sm-10">
                <span class="order-created-at">${(new Date(order.created_at)).toDateString()}</span>
            </div>
        </div>
        <div class="accordion" id="accordion-${order._id}">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#accordion-collapse-${order._id}" aria-expanded="false" aria-controls="collapseOne">
                        Order items
                    </button>
                </h2>
                <div id="accordion-collapse-${order._id}" class="accordion-collapse collapse" aria-labelledby="headingOne"
                    data-bs-parent="#accordion-${order._id}">
                    <div class="accordion-body">
                        ${orderItemsContent}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    return orderElement;
}

function getOrderItemElement(orderItem, currencyRate, currency) {
    currencyRate = currencyRate ? currencyRate : 1;
    currency = currency ? currency : 'EUR';

    return `<div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">Item id: <span
                    class="order-item-id">${orderItem.item}</span></h5>
            <h6 class="card-title">Title: <span class="order-item-title">${orderItem.title}</span>
            </h6>
            <h6 class="card-title">Cost: <span class="order-item-title">${(orderItem.cost * currencyRate).toFixed(2)}</span>&nbsp;${currency}
            </h6>
            <h6 class="card-title">Quantity: <span class="order-item-quantity">${orderItem.quantity}</span>
            </h6>
        </div>
    </div>`;
}

function getCurrencyElements(order) {
    let currencyElements = '';

    if (order.target_currency) {
        currencyElements += `<div class="row mb-3">
            <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Target
                currency</label>
            <div class="col-sm-10">
                <span class="order-target-currency">${order.target_currency}</span>
            </div>
        </div>`;
    }

    currencyElements += `<div class="row mb-3">
        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Total Base Cost
        </label>
        <div class="col-sm-10">
            <span class="order-total-cost-base">${order.total_cost}</span>&nbsp;EUR
        </div>
    </div>`;

    if (order.target_currency) {
        currencyElements += `<div class="row mb-3">
        <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Total Target Cost
        </label>
        <div class="col-sm-10">
            <span class="order-total-cost-target">${order.total_cost * order.currency_rate}</span>&nbsp;${order.target_currency}
        </div>
    </div>`;
    }

    return currencyElements;
}