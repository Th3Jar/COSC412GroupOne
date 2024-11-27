document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display user info
    fetch('/api/user/profile')
        .then(response => response.json())
        .then(data => {
            document.getElementById('userName').textContent = data.name;
            document.getElementById('userEmail').textContent = data.email;
        })
        .catch(err => console.error('Error fetching profile:', err));

    // Fetch and display user listings
    fetch('/api/user/listings')
        .then(response => response.json())
        .then(listings => {
            const listingsContainer = document.getElementById('userListings');
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
});
