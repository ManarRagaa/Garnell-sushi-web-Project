
  document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");
    const calculateBtn = document.getElementById("calculate");
    const proceedToPaymentBtn = document.getElementById("proceed-to-payment");
  
    let cart = JSON.parse(localStorage.getItem("cart")) || [];  
  
    
    function renderCart() {
      cartItems.innerHTML = "";  
      let total = 0;
      cart.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price} LE`;
        cartItems.appendChild(li);
        total += item.price;
      });
      totalPriceEl.textContent = total;  
    }
  
   
    calculateBtn.addEventListener("click", renderCart);
  
    
    proceedToPaymentBtn.addEventListener("click", () => {
      const stripe = Stripe("your-publishable-key-here");  
  
      
      fetch("https://your-server.com/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({
            name: item.name,
            price: item.price,
          })),
        }),
      })
        .then(response => response.json())
        .then(session => {
         
          return stripe.redirectToCheckout({ sessionId: session.id });
        })
        .catch(error => {
          console.error("Error with Stripe checkout:", error);
          alert("Payment failed. Please try again.");
        });
    });
  
   
    renderCart();
  });
    