const cart = [];


document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);
    const item = cart.find((i) => i.name === name);

    if (item) {
      item.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();
  });
});


function updateCart() {
  const cartTableBody = document.querySelector('#cart-items tbody');
  const totalPriceElement = document.getElementById('total-price');
  cartTableBody.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    cartTableBody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price} LE</td>
        <td>${item.quantity}</td>
        <td>${subtotal} LE</td>
        <td><button class="remove-item" data-index="${index}">Remove</button></td>
      </tr>
    `;
  });

  totalPriceElement.textContent = total;

  
  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', () => {
      const index = parseInt(button.dataset.index);
      cart.splice(index, 1);
      updateCart();
    });
  });
}


document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const paymentModal = document.getElementById('payment-modal');
  const paymentAmount = document.getElementById('payment-amount');

  paymentAmount.textContent = document.getElementById('total-price').textContent;
  paymentModal.style.display = 'block';
});


document.getElementById('confirm-payment').addEventListener('click', () => {
  const cardNumber = document.getElementById('card-number').value;

  if (cardNumber.trim() === '') {
    alert('Please enter a valid card number.');
    return;
  }

  alert('Payment successful!');
  cart.length = 0;
  updateCart();

  
  document.getElementById('payment-modal').style.display = 'none';
});
  