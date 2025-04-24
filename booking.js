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
