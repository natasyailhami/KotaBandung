const map = L.map('map')
map.setView([-6.903, 107.6510], 13);
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <ahref="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);

// Basemap Google Maps
const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Map by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Basemap Google Satellite
const baseMapSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  attribution: 'Satellite by <a href="https://maps.google.com/">Google</a>',
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});

// Tambahkan salah satu basemap secara default
basemapOSM.addTo(map);

// Daftar semua pilihan basemap
const baseMaps = {
  "OpenStreetMap": basemapOSM,
  "Google Maps": baseMapGoogle,
  "Google Satellite": baseMapSatellite
};



// Tambahkan kontrol fullscreen
map.addControl(new L.Control.Fullscreen());

// Titik koordinat awal (home)
const home = {
  lat: -6.903,
  lng: 107.6510,
  zoom: 13
};

// Pindahkan tampilan ke lokasi home
map.setView([home.lat, home.lng], home.zoom);

// Tambahkan tombol GPS/lokasi
map.addControl(
  L.control.locate({
    position: 'topleft',
    flyTo: true,
    locateOptions: {
      enableHighAccuracy: true
    }
  })
);

// Tambahkan tombol Home custom
const homeButton = L.Control.extend({
  options: {
    position: 'topleft'
  },
  onAdd: function (map) {
    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    container.innerHTML = '<img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" style="width:20px; height:20px; margin:7px;" title="Go to Home">';
    container.style.backgroundColor = 'white';
    container.style.width = '34px';
    container.style.height = '34px';
    container.style.cursor = 'pointer';

    container.onclick = function () {
      map.setView([home.lat, home.lng], home.zoom);
    };

    return container;
  }
});
map.addControl(new homeButton());

var symbologyPoint = {
  radius: 5,
  fillColor: "#9dfc03",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
  }

  const jembatanPT = new L.LayerGroup();
$.getJSON("./asset/data-spasial/jembatan_pt.geojson", function (OBJECTID) {
L.geoJSON(OBJECTID, {
pointToLayer: function (feature, latlng) {
return L.circleMarker(latlng, symbologyPoint);}
}).addTo(jembatanPT);
});
jembatanPT.addTo(map);

const adminKelurahanAR = new L.LayerGroup();
$.getJSON("./asset/data-spasial/admin_kelurahan_ln.geojson", function (OBJECTID) {
L.geoJSON(OBJECTID, {
style: {
color : "black",
weight : 2,
opacity : 1,
dashArray: '3,3,20,3,20,3,20,3,20,3,20',
lineJoin: 'round'
}
}).addTo(adminKelurahanAR);
});
adminKelurahanAR.addTo(map);

//membuat data land cover
// Membuat layer group dulu
const landcover = new L.LayerGroup();

$.getJSON("./asset/data-spasial/landcover_ar.geojson", function (data) {
  L.geoJSON(data, {
    style: function(feature) {
      switch (feature.properties.REMARK) {
        case 'Danau/Situ': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB"};
        case 'Empang': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB"};
        case 'Hutan Rimba': return {fillColor:"#38A800", fillOpacity: 0.8, color: "#38A800"};
        case 'Perkebunan/Kebun': return {fillColor:"#E9FFBE", fillOpacity: 0.8, color: "#E9FFBE"};
        case 'Permukiman dan Tempat Kegiatan': return {fillColor:"#FFBEBE", fillOpacity: 0.8, weight: 0.5, color: "#FB0101"};
        case 'Sawah': return {fillColor:"#01FBBB", fillOpacity: 0.8, weight: 0.5, color: "#4065EB"};
        case 'Semak Belukar': return {fillColor:"#FDFDFD", fillOpacity: 0.8, weight: 0.5, color: "#00A52F"};
        case 'Sungai': return {fillColor:"#97DBF2", fillOpacity: 0.8, weight: 0.5, color: "#4065EB"};
        case 'Tanah Kosong/Gundul': return {fillColor:"#FDFDFD", fillOpacity: 0.8, weight: 0.5, color: "#000000"};
        case 'Tegalan/Ladang': return {fillColor:"#EDFF85", fillOpacity: 0.8, color: "#EDFF85"};
        case 'Vegetasi Non Budidaya Lainnya': return {fillColor:"#000000", fillOpacity: 0.8, weight: 0.5, color: "#000000"};
        default: return {fillColor:"#FFFFFF", fillOpacity: 0.5, color: "#000000"}; // Tambahkan default biar aman
      }
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup('<b>Tutupan Lahan: </b>' + feature.properties.REMARK);
    }
  }).addTo(landcover);
});

// Tambahkan layer ke map
landcover.addTo(map);

const Component = {
  "Jembatan": jembatanPT,
  "Batas Administrasi": adminKelurahanAR,
  "Penggunaan Lahan": landcover
};

L.control.layers(baseMaps, Component).addTo(map);

// Legenda
let legend = L.control({ position: "topright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    
    div.innerHTML = `
        <p class="legend-title">Legenda</p>

        <p class="legend-section">Infrastruktur</p>
        ${createLegendItem('circle', '#9dfc03', 'Jembatan')}

        <p class="legend-section">Batas Administrasi</p>
        ${createLegendLine('black', '3,3,20,3,20', 'Batas Desa/Kelurahan')}
        <p class="legend-section">Tutupan Lahan</p>
        ${createLegendBox('#97DBF2', 'Danau/Situ')}
        ${createLegendBox('#97DBF2', 'Empang')}
        ${createLegendBox('#38A800', 'Hutan Rimba')}
        ${createLegendBox('#E9FFBE', 'Perkebunan/Kebun')}
        ${createLegendBox('#FFBEBE', 'Permukiman dan Tempat Kegiatan')}
        ${createLegendBox('#01FBBB', 'Sawah')}
        ${createLegendBox('#FDFDFD', 'Semak Belukar', '#ccc')}
        ${createLegendBox('#97DBF2', 'Sungai')}
        ${createLegendBox('#FDFDFD', 'Tanah Kosong/Gundul', '#000')}
        ${createLegendBox('#EDFF85', 'Tegalan/Ladang')}
        ${createLegendBox('#000000', 'Vegetasi Non Budidaya Lainnya')}
    `;

    return div;
};

legend.addTo(map);

// Fungsi pembantu
function createLegendItem(type, color, label) {
    if (type === 'circle') {
        return `
        <div class="legend-item">
            <svg width="20" height="20"><circle cx="10" cy="10" r="5" stroke="black" stroke-width="1" fill="${color}" /></svg>
            <span>${label}</span>
        </div>`;
    }
}

function createLegendLine(color, dash, label) {
  return `
      <div class="legend-item">
          <svg width="30" height="12"><line x1="0" y1="6" x2="30" y2="6" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}" /></svg>
          <span>${label}</span>
      </div>`;
}

function createLegendBox(color, label, border = 'none', whiteText = false) {
  const textColor = whiteText ? 'white' : 'black';
  return `
      <div class="legend-item">
          <div style="width:20px; height:12px; background-color:${color}; border:${border}; margin-right:8px;"></div>
          <span style="color:${textColor};">${label}</span>
      </div>`;
}


