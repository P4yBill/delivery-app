const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function isStringValid(str) {
    return typeof str === 'string' && str?.trim()?.length > 0;
}
function validateEmail(email) {
    return emailRegex.test(email);
};


function loginFormHandler(event) {
    event.preventDefault();
    showLoginContainer();

    const form = $(event.target);
    const email = $(form).find('#email').val();
    const password = $(form).find('#password').val();

    LoginApiContainer
        .post({ email, password }).then((res) => {
            if (res.status == 200) {
                const access_token = res.data.access_token;
                // TODO: remove, api middleware and set cookie
                localStorage.setItem("token", access_token);
                getOrders();
            } else {
                showErrorContainer();
            }
        }).catch((e) => {
            errorContainer.innerHTML = 'Could not log in: ' + error?.response?.data?.message;
            showErrorContainer();
        });

}