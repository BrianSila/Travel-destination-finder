document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const destinationsContainer = document.getElementById('destinations-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('destination-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Global variables
    let allDestinations = [];
    const fetch_url = 'http://localhost:3000/destinations'
    
    // Fetch destinations from JSON server
    async function fetchDestinations() {
        try {
            const response = await fetch(fetch_url);
            if (!response.ok) {
                throw new Error('Failed to fetch destinations');
            }
            allDestinations = await response.json();
            displayDestinations(allDestinations);
        } catch (error) {
            console.error('Error fetching destinations:', error);
            destinationsContainer.innerHTML = '<p class="error">Failed to load destinations. Please try again later.</p>';
        }
    }
    
    // Display destinations in the grid
    function displayDestinations(destinations) {
        destinationsContainer.innerHTML = '';
        
        if (destinations.length === 0) {
            destinationsContainer.innerHTML = '<p class="no-results">No destinations found. Try a different search.</p>';
            return;
        }
        
        destinations.forEach(destination => {
            const destinationCard = document.createElement('div');
            destinationCard.className = 'destination-card';
            destinationCard.innerHTML = `
                <img src="images/${destination.image}" alt="${destination.name}" class="destination-img">
                <div class="destination-info">
                    <h3>${destination.name}</h3>
                    <p class="location">${destination.country}, ${destination.continent}</p>
                    <div class="rating">${getStarRating(destination.rating)}</div>
                    <p class="description">${destination.description}</p>
                    <button class="view-btn" data-id="${destination.id}">View Details</button>
                </div>
            `;
            destinationsContainer.appendChild(destinationCard);
        });
        
        // Add event listeners to view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const destinationId = parseInt(this.getAttribute('data-id'));
                showDestinationDetails(destinationId);
            });
        });
    }
    
    // Get star rating HTML
    function getStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStar;
        
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }
        
        return starsHtml;
    }
    
    // Show destination details in modal
    function showDestinationDetails(id) {
        const destination = allDestinations.find(dest => dest.id === id);
        if (!destination) return;
        
        document.getElementById('modal-image').src = `images/${destination.image}`;
        document.getElementById('modal-image').alt = destination.name;
        document.getElementById('modal-title').textContent = destination.name;
        document.getElementById('modal-location').textContent = `${destination.country}, ${destination.continent}`;
        document.getElementById('modal-rating').innerHTML = getStarRating(destination.rating);
        document.getElementById('modal-description').textContent = destination.longDescription || destination.description;
        document.getElementById('modal-best-time').textContent = destination.bestTimeToVisit;
        document.getElementById('modal-cost').textContent = destination.averageCost;
        document.getElementById('modal-tips').textContent = destination.travelTips;
        
        modal.style.display = 'block';
    }
    
    // Filter destinations by continent
    function filterDestinations(continent) {
        if (continent === 'all') {
            displayDestinations(allDestinations);
            return;
        }
        
        const filtered = allDestinations.filter(dest => dest.continent.toLowerCase() === continent);
        displayDestinations(filtered);
    }
    
    // Search destinations
    function searchDestinations() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            displayDestinations(allDestinations);
            return;
        }
        
        const results = allDestinations.filter(dest => 
            dest.name.toLowerCase().includes(searchTerm) || 
            dest.country.toLowerCase().includes(searchTerm) ||
            dest.continent.toLowerCase().includes(searchTerm) ||
            dest.description.toLowerCase().includes(searchTerm)
        );
        
        displayDestinations(results);
    }
    
    // Event Listeners
    searchBtn.addEventListener('click', searchDestinations);
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchDestinations();
        }
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const continent = this.getAttribute('data-continent');
            filterDestinations(continent);
        });
    });
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Initialize the app
    fetchDestinations();
});