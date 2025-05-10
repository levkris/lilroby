const loginForm = document.getElementById('login-form');

const errorTxt = document.getElementById('error-login');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    fetch("https://wokki20.nl/lilroby/api/v1/login", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success == true) {
            console.log(data);
        } else {
            errorTxt.innerText = data.error;
        }
    })
    .catch(error => console.error("Error:", error));
});
