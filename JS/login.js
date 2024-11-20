document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre_usuario = document.getElementById('username').value;
        const contrasena = document.getElementById('password').value;

        const loginData = {
            nombre_usuario,
            contrasena
        };

        fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('token', data.token);
                window.location.href = 'home.html';
            } else {
                alert(data.mensaje);
            }
        })
        .catch(error => {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un problema con el inicio de sesión. Intenta nuevamente.');
        });
    });
});