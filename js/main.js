// Activate the div on click
function activateInput(divElement) {
    const placeholder = divElement.querySelector('.placeholder');
    const form = divElement.querySelector('.hidden-form');

    // Add active class to the div
    divElement.classList.add('active');

    // Hide the placeholder and show the form
    if (placeholder) placeholder.style.display = 'none';
    if (form) {
        form.style.display = 'block';
        const input = form.querySelector('input');
        if (input) input.focus(); // Focus the input field
    }
}

// Deactivate the div when input loses focus
// function deactivateInput(inputElement) {
//     const form = inputElement.closest('.hidden-form');
//     const divElement = inputElement.closest('.hero__trip__box');
//     const placeholder = divElement.querySelector('.placeholder');

//     // Remove active class if the input is empty
//     if (inputElement.value.trim() === '') {
//         divElement.classList.remove('active');
//         if (placeholder) placeholder.style.display = 'block';
//         if (form) form.style.display = 'none';
//     }
// }

// Attach event listener to the divs
document.addEventListener('DOMContentLoaded', () => {
    const tripBoxes = document.querySelectorAll('.hero__trip__box');
    tripBoxes.forEach((box) => {
        box.addEventListener('click', function () {
            activateInput(this);
        });
    });
});


const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your actual API key

// Toggle location icon and populate user location
function toggleLocationIcon(iconElement) {
    const tripBox = iconElement.closest('.hero__trip__box');
    const input = tripBox.querySelector('input[type="text"]');
    const isFlipped = iconElement.classList.contains('flipped');

    if (isFlipped) {
        // Reset to original state (location icon)
        iconElement.src = '../assets/icons/geo-alt.svg';
        iconElement.classList.remove('flipped');
        input.value = ''; // Clear the input field
    } else {
        // Change to close button and fetch location
        iconElement.src = '../assets/icons/x.svg';
        iconElement.classList.add('flipped');

        // Fetch and populate user location
        fetchUserAddress(input);
    }

    // Focus on the input field
    input.focus();
}

// Fetch user location and reverse geocode to get the address
function fetchUserAddress(input) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Reverse geocode the coordinates to get the address
                reverseGeocode(latitude, longitude, input);
            },
            (error) => {
                console.error('Error fetching location:', error);

                // Handle errors gracefully
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        input.value = 'Permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        input.value = 'Location unavailable';
                        break;
                    case error.TIMEOUT:
                        input.value = 'Location request timed out';
                        break;
                    default:
                        input.value = 'Unable to fetch location';
                        break;
                }
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        input.value = 'Geolocation not supported';
    }
}

// Reverse geocode the coordinates to get an address
function reverseGeocode(lat, lng, input) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'OK' && data.results.length > 0) {
                // Get the first result (most relevant address)
                const address = data.results[0].formatted_address;
                input.value = address; // Populate the input field with the address
            } else {
                input.value = 'Unable to fetch address';
            }
        })
        .catch((error) => {
            console.error('Error reverse geocoding:', error);
            input.value = 'Unable to fetch address';
        });
}


function toggleFAQ(headerElement) {
    const content = headerElement.nextElementSibling; // Get the FAQ content
    const isActive = headerElement.classList.contains('active');

    // Collapse other FAQs if needed (optional)
    document.querySelectorAll('.FAQ__Question__header').forEach((header) => {
        header.classList.remove('active');
        header.nextElementSibling.style.display = 'none';
    });

    // Toggle the clicked FAQ
    if (!isActive) {
        headerElement.classList.add('active');
        content.style.display = 'block';
    } else {
        headerElement.classList.remove('active');
        content.style.display = 'none';
    }
}
