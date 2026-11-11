# Mapa měst ČR (Leaflet)

Jednoduchá webová mapa měst České republiky postavená na [Leafletu](https://leafletjs.com/).
Data bodů se načítají ze souboru GeoJSON.

## Struktura

| Soubor          | Účel                                                  |
|-----------------|-------------------------------------------------------|
| `index.html`    | Stránka, načtení Leafletu a vlastních souborů         |
| `map.js`        | Inicializace mapy, načtení GeoJSONu, popupy, seznam   |
| `styl.css`      | Vzhled stránky a postranního panelu                   |
| `body.geojson`  | Data měst (FeatureCollection, geometrie typu Point)   |
| `README.md`     | Tento popis                                           |

## Spuštění

Data se načítají přes `fetch`, takže stránku nelze otevřít dvojklikem (`file://`).
Spusťte lokální server ve složce projektu:

```bash
python -m http.server 8000
```

a otevřete <http://localhost:8000>.
Alternativy: `npx serve`, rozšíření Live Server ve VS Code apod.

## Formát dat

Každé město je jeden `Feature`:

```json
{
  "type": "Feature",
  "properties": {
    "id": 3,
    "nazev": "Brno",
    "popisek": "Krátký popis města."
  },
  "geometry": { "type": "Point", "coordinates": [16.6068, 49.1951] }
}
```

- **Pozor na pořadí souřadnic:** GeoJSON používá `[délka, šířka]` (lon, lat), Leaflet interně `[šířka, délka]`.
- `id` musí být unikátní, používá se k propojení seznamu s body na mapě.
- Nové město přidáte jen přidáním dalšího `Feature` do pole `features`, kód se nemění.

## Použité technologie

- Leaflet 1.9.4 (CDN unpkg)
- Podkladové dlaždice © přispěvatelé OpenStreetMap
