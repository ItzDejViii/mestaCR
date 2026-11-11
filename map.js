// Mapa měst ČR – Leaflet + GeoJSON
const STRED_CR = [49.8, 15.5];
const VYCHOZI_ZOOM = 7;
const SOUBOR_DAT = 'body.geojson';

const mapa = L.map('mapa').setView(STRED_CR, VYCHOZI_ZOOM);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);

// Ochrana proti vložení HTML z dat do popupu
function escapeHtml(text) {
  const el = document.createElement('div');
  el.textContent = text ?? '';
  return el.innerHTML;
}

function vytvorPopup(props) {
  return `<div class="popup"><h2>${escapeHtml(props.nazev)}</h2><p>${escapeHtml(props.popisek)}</p></div>`;
}

const markeryPodleId = new Map();

function zobrazChybu(zprava) {
  const el = document.getElementById('chyba');
  el.textContent = zprava;
  el.hidden = false;
}

async function nactiData() {
  try {
    const odpoved = await fetch(SOUBOR_DAT);
    if (!odpoved.ok) throw new Error(`HTTP ${odpoved.status}`);
    const data = await odpoved.json();

    const vrstva = L.geoJSON(data, {
      onEachFeature(feature, layer) {
        const p = feature.properties;
        layer.bindPopup(vytvorPopup(p));
        layer.bindTooltip(p.nazev);
        markeryPodleId.set(p.id, layer);
      }
    }).addTo(mapa);

    naplnSeznam(data.features);

    if (vrstva.getLayers().length > 1) {
      mapa.fitBounds(vrstva.getBounds(), { padding: [60, 60] });
    }
  } catch (chyba) {
    console.error(chyba);
    zobrazChybu(
      'Data se nepodařilo načíst. Otevřete stránku přes lokální server ' +
      '(např. "python -m http.server"), ne přímo ze souboru.'
    );
  }
}

function naplnSeznam(features) {
  const seznam = document.getElementById('seznam');
  features.forEach(({ properties: p }) => {
    const li = document.createElement('li');
    const tlacitko = document.createElement('button');
    tlacitko.type = 'button';

    const nazev = document.createElement('strong');
    nazev.textContent = p.nazev;
    const popisek = document.createElement('span');
    popisek.textContent = p.popisek;
    tlacitko.append(nazev, popisek);

    tlacitko.addEventListener('click', () => {
      const marker = markeryPodleId.get(p.id);
      if (!marker) return;
      mapa.flyTo(marker.getLatLng(), 11);
      marker.openPopup();
    });

    li.appendChild(tlacitko);
    seznam.appendChild(li);
  });
}

nactiData();
