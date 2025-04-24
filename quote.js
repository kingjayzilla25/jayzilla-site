document.getElementById('addStop').addEventListener('click', () => {
    const stopsDiv = document.getElementById('stops');
    const newStop = document.createElement('label');
    newStop.className = 'block mb-4';
    newStop.innerHTML = `Drop-off Location:
        <input type="text" class="dropoff w-full border p-2 mt-1" required>`;
    stopsDiv.appendChild(newStop);
});

document.getElementById('calculate').addEventListener('click', () => {
    const pickup = document.getElementById('pickup').value;
    const dropoffs = Array.from(document.getElementsByClassName('dropoff')).map(input => input.value);

    if (!pickup || dropoffs.some(addr => !addr)) {
        alert('Please enter all addresses.');
        return;
    }

    const service = new google.maps.DistanceMatrixService();
    const destinations = dropoffs;
    const origins = [pickup];

    service.getDistanceMatrix({
        origins: origins,
        destinations: destinations,
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }, (response, status) => {
        if (status !== 'OK') {
            alert('Error: ' + status);
        } else {
            let totalMiles = 0;
            const results = response.rows[0].elements;
            results.forEach(result => {
                if (result.status === "OK") {
                    totalMiles += result.distance.value / 1609.34; // meters to miles
                }
            });
            totalMiles = totalMiles.toFixed(2);
            document.getElementById('mileage').innerText = totalMiles;
            document.getElementById('price').innerText = (totalMiles * 1.25).toFixed(2);
        }
    });
});
