const lat = 15.10, lon = 80.50;
const token = 'pk.eyJ1IjoiamFmZmVycmlsd2Fhbjk5IiwiYSI6ImNtdnpoemN2MjFwZzgzNXF2cjA3aXpzcnYifQ.DRTtwQCySkTAHyXLGvw6yg';

// isBayOfBengal: lat >= 5 && lat <= 23 && lon >= 79.5 && lon <= 96 -> true!
// targetZoom: isOceanic ? Math.min(5, 5) : 5 -> 5
const url = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon.toFixed(4)},${lat.toFixed(4)},5,0/700x450@2x?access_token=${token}`;
console.log('Testing URL:', url);
fetch(url).then(r => console.log('Status:', r.status, r.headers.get('content-type'))).catch(e => console.error(e));

const urlZ13 = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon.toFixed(4)},${lat.toFixed(4)},13,0/700x450@2x?access_token=${token}`;
console.log('Testing Z13:', urlZ13);
fetch(urlZ13).then(r => console.log('Status Z13:', r.status, r.headers.get('content-type'))).catch(e => console.error(e));
