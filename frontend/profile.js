document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display user profile information
    fetch('/api/user/profile')
        .then(response => response.json())
        .then(data => {
            // Populate user details in the UI
            document.getElementById('userName').textContent = data.name;
            document.getElementById('userEmail').textContent = data.email;

            // Display payment details for CashApp and Venmo
            document.getElementById('cashAppUsername').textContent = data.cashApp || 'Not provided';
            document.getElementById('venmoUsername').textContent = data.venmo || 'Not provided';
        })
        .catch(err => console.error('Error fetching profile:', err));

    // Fetch and display user listings
    fetch('/api/user/listings')
        .then(response => response.json())
        .then(listings => {
            const listingsContainer = document.getElementById('userListings');
            listingsContainer.innerHTML = ''; // Clear existing listings

            // Handle case when no listings are available
            if (listings.length === 0) {
                listingsContainer.innerHTML = '<p class="text-muted">No listings created.</p>';
                return;
            }

            // Dynamically add each listing to the UI
            listings.forEach(listing => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';

                listItem.innerHTML = `
                    <span>${listing.title}</span>
                    <div>
                        <button class="btn btn-outline-secondary btn-sm">Edit</button>
                        <button class="btn btn-outline-danger btn-sm">Delete</button>
                    </div>
                `;

                listingsContainer.appendChild(listItem);
            });
        })
        .catch(err => console.error('Error fetching listings:', err));

    // Fetch and display payment history for buyers
    fetch('/api/user/paymentHistory')
        .then(response => response.json())
        .then(paymentHistory => {
            const paymentHistoryContainer = document.getElementById('paymentHistoryContainer');
            paymentHistoryContainer.innerHTML = ''; // Clear existing payment history

            // Handle case when no payment history is available
            if (paymentHistory.length === 0) {
                paymentHistoryContainer.innerHTML = '<p>No payment history available.</p>';
                return;
            }

            // Dynamically display payment history
            paymentHistory.forEach(payment => {
                const paymentDiv = document.createElement('div');
                paymentDiv.className = 'payment-item card mb-3 p-3';

                paymentDiv.innerHTML = `
                    <h5>${payment.listingTitle}</h5>
                    <p><strong>Seller Name:</strong> ${payment.sellerName}</p>
                    <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
                    <p><strong>Completion Date:</strong> ${new Date(payment.completionDate).toLocaleDateString()}</p>
                `;

                paymentHistoryContainer.appendChild(paymentDiv);
            });
        })
        .catch(error => console.error('Error fetching payment history:', error));

    // Fetch and display order history for sellers
    fetch('/api/user/orderHistory')
        .then(response => response.json())
        .then(orderHistory => {
            const orderHistoryContainer = document.getElementById('orderHistoryContainer');
            orderHistoryContainer.innerHTML = ''; // Clear existing order history

            // Handle case when no order history is available
            if (orderHistory.length === 0) {
                orderHistoryContainer.innerHTML = '<p>No order history available.</p>';
                return;
            }

            // Dynamically display order history
            orderHistory.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order-item card mb-3 p-3';

                orderDiv.innerHTML = `
                    <h5>${order.listingTitle}</h5>
                    <p><strong>Buyer Name:</strong> ${order.buyerName}</p>
                    <p><strong>Transaction ID:</strong> ${order.transactionId}</p>
                    <p><strong>Completion Date:</strong> ${new Date(order.completionDate).toLocaleDateString()}</p>
                `;

                orderHistoryContainer.appendChild(orderDiv);
            });
        })
        .catch(error => console.error('Error fetching order history:', error));
});

// Handle marking an item as received
function handleMarkAsReceived(listingId, reservationDiv) {
    fetch('/api/listings/markAsReceived', {
        method: 'POST', // Use POST method for modifying data
        headers: { 'Content-Type': 'application/json' }, // Specify JSON format for the request body
        body: JSON.stringify({ listingId }) // Include the listing ID in the request body
    })
        .then(async response => {
            if (!response.ok) {
                const errorMessage = await response.text(); // Parse the error response
                throw new Error(errorMessage); // Throw an error for further handling
            }
            return response.text(); // Parse the success response as text
        })
        .then(message => {
            alert(message); // Notify the user of success

            // Update the UI dynamically to indicate the item has been marked as received
            reservationDiv.querySelector('button').remove(); // Remove the "Mark as Received" button

            const completedMsg = document.createElement('p');
            completedMsg.className = 'text-success mt-2'; // Add success styling
            completedMsg.textContent = 'Payment has been received for this item. Please deliver the item to the buyer.';

            reservationDiv.appendChild(completedMsg); // Add confirmation message
        })
        .catch(error => {
            console.error('Error marking as received:', error.message); // Log errors
            alert(`An error occurred: ${error.message}`); // Notify the user of failure
        });
}