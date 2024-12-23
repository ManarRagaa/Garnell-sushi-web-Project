document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reservation-form");
  const statusDiv = document.getElementById("reservation-status");
  const submitButton = document.getElementById("submit-reservation");

  submitButton.addEventListener("click", (event) => {
    // Prevent default form submission
    event.preventDefault();

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      branch: form.branch.value.trim(),
      date: form.date.value.trim(),
      time: form.time.value.trim(),
      guests: form.guests.value.trim(),
    };
  
    // Validate form fields
    if (
      !formData.name || !formData.email || !formData.phone || 
      !formData.branch || !formData.date || !formData.time || 
      !formData.guests
    ) {
      statusDiv.textContent = "All fields are required!";
      statusDiv.style.color = "red";
      return;
    }

    // Send form data to Flask backend as JSON
    fetch("/submit-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Reservation Response: ", data);
      if (data.error) {
        statusDiv.textContent = `Error: ${data.error}`;
        statusDiv.style.color = "red";
      } else {
        // Display reservation details
        const details = `
          <h3>Reservation Confirmed</h3>
          <p><strong>Name:</strong> ${data.reservation_details.name}</p>
          <p><strong>Email:</strong> ${data.reservation_details.email}</p>
          <p><strong>Phone:</strong> ${data.reservation_details.phone}</p>
          <p><strong>Branch:</strong> ${data.reservation_details.branch}</p>
          <p><strong>Date:</strong> ${data.reservation_details.date}</p>
          <p><strong>Time:</strong> ${data.reservation_details.time}</p>
          <p><strong>Guests:</strong> ${data.reservation_details.guests}</p>
        `;
        statusDiv.innerHTML = details;
        statusDiv.style.color = "black";
        form.reset(); // Reset the form after submission
      }
    })
    .catch(error => {
      console.error("Error:", error);
      statusDiv.textContent = "An error occurred. Please try again.";
      statusDiv.style.color = "red";
    });
  });
});
