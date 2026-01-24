-- Build emissions table from OWID CO2 dataset

DROP TABLE IF EXISTS emissions;

CREATE TABLE emissions AS
SELECT
  country,
  iso_code,
  year,
  population,
  gdp,
  co2,
  co2_per_capita,
  co2_including_luc,
  energy_per_capita,
  primary_energy_consumption
FROM read_csv_auto(
  'data/owid-co2-data.csv',
  IGNORE_ERRORS = true
);

-- Remove aggregate regions like "World", "Europe", etc.
DELETE FROM emissions
WHERE iso_code IS NULL;

