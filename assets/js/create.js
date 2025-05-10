const createForm = document.getElementById('create-account-form');

const errorTxt = document.getElementById('error-create-account');

createForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);

    fetch("https://wokki20.nl/lilroby/api/v1/create_account", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "login.html";
        } else {
            errorTxt.innerText = data.error;
        }
    })
    .catch(error => console.error("Error:", error));
});
