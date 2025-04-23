const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { origins, destinations } = event.queryStringParameters;

    if (!origins || !destinations) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Please provide both origins and destinations" }),
        };
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== 'OK') {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to fetch distance data' }),
            };
        }

        const distance = data.rows[0].elements[0].distance.text;
        const duration = data.rows[0].elements[0].duration.text;
        const price = calculatePrice(distance);

        return {
            statusCode: 200,
            body: JSON.stringify({
                distance,
                duration,
                price
            }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};

function calculatePrice(distance) {
    const distanceInMiles = parseFloat(distance.replace(/[^0-9\.]+/g, '')) * 0.621371;
    return (distanceInMiles * 1.25).toFixed(2); // $1.25 per mile
}
