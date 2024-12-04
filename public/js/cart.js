const TAX_RATE = 0.0675;
const DELIVERY_FEE = 5.00;

function showCart() {
    let subtotal = 0;

    document.querySelectorAll('tbody tr').forEach((row) => {
        const priceElement = row.querySelector('td:nth-child(3)');
        const quantityInput = row.querySelector('td:nth-child(2) input');
        const totalElement = row.querySelector('td:nth-child(4)');

        const price = parseFloat(priceElement.textContent.replace('$', ''));
        const quantity = parseInt(quantityInput.value);

        const itemTotal = price * quantity;
        totalElement.textContent = `$${itemTotal.toFixed(2)}`;

        subtotal += itemTotal;
    });

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + DELIVERY_FEE;

    document.querySelector('.cart-summary p:nth-child(1)').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    document.querySelector('.cart-summary p:nth-child(2)').textContent = `Tax (6.75%): $${tax.toFixed(2)}`;
    document.querySelector('.cart-summary p:nth-child(3)').textContent = `Delivery Fee: $${DELIVERY_FEE.toFixed(2)}`;
    document.querySelector('.cart-summary p:nth-child(4)').textContent = `Total: $${total.toFixed(2)}`;
}

function setUpUpdate() {
    const items = document.querySelectorAll('tr');

    items.forEach(item => {
        console.log('Processing item:', item); // Log each item
        const updateBtn = item.querySelector('.update-btn');
        if (!updateBtn) {
            console.error('No update button found for item:', item);
        } else {
            updateBtn.addEventListener('click', () => updateItemQuantity(item));
        }
    });

}

function updateItemQuantity(item) {
    const quantityInput = item.querySelector('.quantityInput');
    const quantity = quantityInput.value;
    const cartItemId = quantityInput.dataset.id;

    const data = {
        quantity: quantity,
        id: cartItemId
    };

    fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Form data successfully sent:', data);
            window.location.href = '/cart';
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
document.addEventListener('DOMContentLoaded', () => {
    showCart();
    setUpUpdate();
});
