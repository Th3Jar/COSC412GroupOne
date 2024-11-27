document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
            const navbar = document.getElementById('dynamicNavbar');
            navbar.innerHTML = '';

            if (data.loggedIn) {
                // User is logged in
                navbar.innerHTML = `
                    <li class="nav-item">
                        <a class="nav-link" href="profile.html">
                            <i class="bi bi-person-circle"></i> Account
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="frontPage.html">
                            <i class="bi bi-bag-fill"></i> Shop
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="cart.html">
                            <i class="bi bi-cart-fill"></i> Cart
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/logout">Logout</a>
                    </li>
                `;
            } else {
                // User is not logged in
                navbar.innerHTML = `
                    <li class="nav-item">
                        <a class="nav-link" href="signUp.html">Sign Up</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="Login.html">Login</a>
                    </li>
                `;
            }
        })
        .catch(err => console.error('Error fetching user status:', err));
});
