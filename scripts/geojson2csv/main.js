import fs from 'node:fs'
import path from 'node:path'

const inputPath = process.argv[2] || './snow_cannons.geojson'
const outDir = './out'

// Create ./out directory if it doesn't exist
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

// Generate output filename based on input file name
const baseName = path.basename(inputPath, path.extname(inputPath))
const outputPath = path.join(outDir, `${baseName}.csv`)

const geojson = JSON.parse(fs.readFileSync(inputPath, 'utf8'))

// Validate GeoJSON structure
if (geojson.type !== 'FeatureCollection' || !Array.isArray(geojson.features)) {
    console.error('Invalid GeoJSON: expected FeatureCollection with features[]')
    process.exit(1)
}

// Collect all unique property keys across all features
const columnSet = new Set()
for (const f of geojson.features) {
    if (f.properties && typeof f.properties === 'object') {
        for (const k of Object.keys(f.properties)) columnSet.add(k)
    }
}

// Add geometry-related columns
columnSet.add('latitude')
columnSet.add('longitude')

const columns = Array.from(columnSet)

// Escape CSV values (handle commas and quotes)
const escapeCSV = (v) => {
    if (v === null || v === undefined) return ''
    const s = String(v)
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
}

const rows = [columns.join(',')]

// Build CSV rows from features
for (const f of geojson.features) {
    const props = f.properties || {}
    let lat = '',
        lon = ''

    if (f.geometry?.type === 'Point' && Array.isArray(f.geometry.coordinates)) {
        ;[lon, lat] = f.geometry.coordinates
    }

    const obj = { ...props, latitude: lat, longitude: lon }
    const line = columns.map((c) => escapeCSV(obj[c] ?? '')).join(',')
    rows.push(line)
}

// Write CSV file
fs.writeFileSync(outputPath, rows.join('\n'), 'utf8')
console.log(`✅ CSV created: ${outputPath} (${rows.length - 1} rows)`)
