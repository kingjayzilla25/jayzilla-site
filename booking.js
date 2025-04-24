document.getElementById('calculate').addEventListener('click', () => {
    const pickup = document.getElementById('pickup').value;
    const dropoff = document.getElementById('dropoff').value;

    if (!pickup || !dropoff) {
        alert('Please enter both pickup and drop-off addresses.');
        return;
    }

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [pickup],
        destinations: [dropoff],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, (response, status) => {
        if (status !== 'OK') {
            alert('Error: ' + status);
        } else {
            const result = response.rows[0].elements[0];
            if (result.status === "OK") {
                let miles = result.distance.value / 1609.34;
                miles = miles.toFixed(2);
                document.getElementById('mileage').innerText = miles;
                document.getElementById('price').innerText = (miles * 1.25).toFixed(2);
            }
        }
    });
});

// Handle Form Submission via AJAX
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('https://formspree.io/f/mzzenndl', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
    }).then(response => {
        if (response.ok) {
            document.getElementById('confirmationMessage').innerText = 
                "Thank you! We have received your booking request and will contact you shortly.";
            document.getElementById('confirmationMessage').classList.remove('hidden');
            this.reset();
            document.getElementById('mileage').innerText = "0";
            document.getElementById('price').innerText = "0.00";
        } else {
            alert('There was an issue submitting your booking. Please try again.');
        }
    });
});
