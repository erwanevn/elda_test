-- ========================================
-- Script de création des tables
-- ========================================

-- Extension PostGIS (optionnelle, si vous voulez utiliser des types géométriques)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- ========================================
-- Table : snow_cannons (Enneigeurs)
-- ========================================
CREATE TABLE IF NOT EXISTS snow_cannons (
    id SERIAL PRIMARY KEY,
    numero_regard INTEGER NOT NULL UNIQUE,
    secteur INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('lance', 'autonome', 'tour')),
    nom_piste VARCHAR(255),
    latitude FLOAT NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude FLOAT NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances des recherches
CREATE INDEX IF NOT EXISTS idx_snow_cannons_secteur ON snow_cannons(secteur);
CREATE INDEX IF NOT EXISTS idx_snow_cannons_type ON snow_cannons(type);
CREATE INDEX IF NOT EXISTS idx_snow_cannons_numero_regard ON snow_cannons(numero_regard);

-- ========================================
-- Table : snow_cannon_measurements (Mesures)
-- ========================================
CREATE TABLE IF NOT EXISTS snow_cannon_measurements (
    id SERIAL PRIMARY KEY,
    snow_cannon_id INTEGER NOT NULL REFERENCES snow_cannons(id) ON DELETE CASCADE,
    conso_eau_m3 FLOAT DEFAULT 0 CHECK (conso_eau_m3 >= 0),
    objectif_mini_m3 FLOAT DEFAULT 0 CHECK (objectif_mini_m3 >= 0),
    objectif_max_m3 FLOAT DEFAULT 0 CHECK (objectif_max_m3 >= 0),
    duree_fonctionnement_h FLOAT DEFAULT 0 CHECK (duree_fonctionnement_h >= 0),
    date_mesure DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Une seule mesure par enneigeur par jour
    UNIQUE(snow_cannon_id, date_mesure)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_measurements_snow_cannon_id ON snow_cannon_measurements(snow_cannon_id);
CREATE INDEX IF NOT EXISTS idx_measurements_date ON snow_cannon_measurements(date_mesure);
CREATE INDEX IF NOT EXISTS idx_measurements_conso ON snow_cannon_measurements(conso_eau_m3);

-- ========================================
-- Trigger pour mettre à jour updated_at automatiquement
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_snow_cannons_updated_at
    BEFORE UPDATE ON snow_cannons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Commentaires sur les tables (documentation)
-- ========================================
COMMENT ON TABLE snow_cannons IS 'Table contenant les informations fixes des enneigeurs';
COMMENT ON TABLE snow_cannon_measurements IS 'Table contenant les mesures de consommation des enneigeurs';

COMMENT ON COLUMN snow_cannons.numero_regard IS 'Numéro unique identifiant l''enneigeur';
COMMENT ON COLUMN snow_cannons.secteur IS 'Numéro du secteur géographique';
COMMENT ON COLUMN snow_cannons.type IS 'Type d''enneigeur : lance, autonome ou tour';
COMMENT ON COLUMN snow_cannons.nom_piste IS 'Nom de la piste associée';
COMMENT ON COLUMN snow_cannons.latitude IS 'Latitude GPS de l''enneigeur';
COMMENT ON COLUMN snow_cannons.longitude IS 'Longitude GPS de l''enneigeur';

COMMENT ON COLUMN snow_cannon_measurements.conso_eau_m3 IS 'Consommation d''eau en mètres cubes';
COMMENT ON COLUMN snow_cannon_measurements.objectif_mini_m3 IS 'Objectif minimum de consommation';
COMMENT ON COLUMN snow_cannon_measurements.objectif_max_m3 IS 'Objectif maximum de consommation';
COMMENT ON COLUMN snow_cannon_measurements.duree_fonctionnement_h IS 'Durée de fonctionnement en heures';
COMMENT ON COLUMN snow_cannon_measurements.date_mesure IS 'Date de la mesure';

-- ========================================
-- Afficher un message de confirmation
-- ========================================
DO $$
BEGIN
    RAISE NOTICE 'Tables créées avec succès !';
    RAISE NOTICE 'Vous pouvez maintenant importer les données de test.';
END $$;