document.addEventListener('DOMContentLoaded', function() {
    const paymentForm = document.getElementById('paymentForm');
    const cancelBtn = document.getElementById('cancelBtn');

    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const cardholderName = document.getElementById('cardholder-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const expirationDate = document.getElementById('expiration-date').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardholderName || !cardNumber || !expirationDate || !cvv) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        alert('Pago realizado con éxito.');
        guardarOrden();
    });

    cancelBtn.addEventListener('click', function() {
        window.location.href = 'carrito.html';
    });

    function guardarOrden() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const carrito = JSON.parse(localStorage.getItem('cart')) || [];
        if (carrito.length === 0) {
            alert('El carrito está vacío. No se puede guardar una orden vacía.');
            return;
        }

        const montoTotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
        const detalles = carrito.map(item => ({
            producto_id: item.id,
            cantidad: item.cantidad,
            precio: item.precio
        }));

        const usuarioId = JSON.parse(atob(token.split('.')[1])).user_id;

        fetch('http://127.0.0.1:5000/api/ordenes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                estado: 'pendiente',
                monto_total: montoTotal,
                detalles: detalles
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Orden guardada con éxito.');
                localStorage.removeItem('cart');
                window.location.href = 'home.html';
            } else {
                alert(`Error al guardar la orden: ${data.mensaje}`);
            }
        })
        .catch(error => {
            console.error('Error al guardar la orden:', error);
            alert('Hubo un error al guardar la orden.');
        });
    }
});