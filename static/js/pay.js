document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const receiptItemsTable = document.querySelector('#cart-items tbody');
  const grandTotalElement = document.getElementById('grand-total');

  if (cart.length === 0) {
    alert('Your cart is empty! Add items to view the receipt.');
    return;
  }

  function displayReceipt() {
    receiptItemsTable.innerHTML = ''; 
    let grandTotal = 0;

    cart.forEach(item => {
      if (!item.name || !item.price || !item.quantity) {
        console.error('Invalid item in cart:', item);
        return; 
      }

      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      nameCell.textContent = item.name;
      row.appendChild(nameCell);

      const priceCell = document.createElement('td');
      priceCell.textContent = `${item.price} LE`;
      row.appendChild(priceCell);

      const quantityCell = document.createElement('td');
      quantityCell.textContent = item.quantity;
      row.appendChild(quantityCell);

      const subtotalCell = document.createElement('td');
      const subtotal = item.price * item.quantity; 
      subtotalCell.textContent = `${subtotal} LE`;
      row.appendChild(subtotalCell);

      receiptItemsTable.appendChild(row);
      grandTotal += subtotal; 
    });

    grandTotalElement.textContent = `${grandTotal} LE`; 
  }

  displayReceipt();

  document.getElementById('clearButton').addEventListener('click', () => {
    localStorage.removeItem('cart');
    receiptItemsTable.innerHTML = '';
    grandTotalElement.textContent = '0 LE';
    alert('Your cart has been cleared.');
  });
});
