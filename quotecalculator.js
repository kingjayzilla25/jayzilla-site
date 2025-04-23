const fetch = require('node-fetch');

exports.handler = async (event) => {
    const { origins, destinations } = event.queryStringParameters;

    if (!origins || !destinations) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing origins or destinations parameter' }),
        };
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const distanceText = data.rows[0].elements[0].distance.text;
        const durationText = data.rows[0].elements[0].duration.text;

        const distanceValue = data.rows[0].elements[0].distance.value / 1000; // in KM
        const price = (distanceValue * 0.65).toFixed(2); // Example rate

        return {
            statusCode: 200,
            body: JSON.stringify({
                origin: data.origin_addresses[0],
                destination: data.destination_addresses[0],
                distance: distanceText,
                duration: durationText,
                estimated_price: `$${price}`
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from Google Maps API' }),
        };
    }
};
