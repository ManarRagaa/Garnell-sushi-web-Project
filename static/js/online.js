document.getElementById('order-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const menuItem = document.getElementById('menu-item').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const prices = {
    'Fried Rolls': 50,
    'Volcano': 70,
    'Chocolate Cake': 150,
  };
  const itemPrice = prices[menuItem];
  const itemTotal = itemPrice * quantity;

  // Save to localStorage
  let orderItems = JSON.parse(localStorage.getItem('cart')) || [];
  orderItems.push({ menuItem, quantity, itemPrice, itemTotal });
  localStorage.setItem('cart', JSON.stringify(orderItems));

  updateOrderSummary(orderItems);
});

function updateOrderSummary(orderItems) {
  document.getElementById('order-summary').style.display = 'block';
  const orderDetails = orderItems.map(item => `
    <tr>
      <td>${item.menuItem}</td>
      <td>${item.quantity}</td>
      <td>${item.itemPrice} LE</td>
      <td>${item.itemTotal} LE</td>
    </tr>
  `).join('');
  document.getElementById('order-details').innerHTML = orderDetails;
  document.getElementById('total-price').textContent = orderItems.reduce((total, item) => total + item.itemTotal, 0);

  document.getElementById('confirm-order-btn').addEventListener('click', function() {
    document.getElementById('confirmation-message').style.display = 'block';
  });

  document.getElementById('clear-order-btn').addEventListener('click', function() {
    document.getElementById('order-details').innerHTML = '';
    document.getElementById('total-price').innerText = '0';
    document.getElementById('confirmation-message').style.display = 'none';
  });
}