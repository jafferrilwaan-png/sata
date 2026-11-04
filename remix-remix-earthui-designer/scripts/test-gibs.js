const lat = 15.10, lon = 80.50, z = 6;
const n = Math.pow(2, z);
const x = Math.floor(((lon + 180) / 360) * n);
const latRad = (lat * Math.PI) / 180;
const y = Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n);
console.log({x, y, z});
const url = "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-06-01/GoogleMapsCompatible_Level9/" + z + "/" + y + "/" + x + ".jpg";
console.log(url);
fetch(url).then(r => console.log("status:", r.status, r.headers.get("content-type"))).catch(e => console.error(e));
