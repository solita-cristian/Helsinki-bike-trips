# Data fetching

#Fetching the stations CSV file
curl --request GET -fL \
  --url "https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv" \
  --output "stations.csv"

#Fetching the trips CSV file
curl --request GET -fL \
  --url "https://dev.hsl.fi/citybikes/od-trips-2021/2021-{05,06,07}.csv" \
  --output "2021-#1.csv"

# Process CSV data
python3 migration.py

# CREATE stations table
sudo -u postgres psql -d postgres --user=postgres -c "CREATE TABLE stations(
    fid SERIAL PRIMARY KEY,
    id INTEGER UNIQUE NOT NULL,
    name_fi VARCHAR(50) NOT NULL,
    name_se VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    address_fi VARCHAR(50) NOT NULL,
    address_se VARCHAR(50) NOT NULL,
    city_fi VARCHAR(20),
    city_se VARCHAR(20),
    operator VARCHAR(20),
    capacity INTEGER,
    x REAL NOT NULL,
    y REAL NOT NULL
);"

# Copy stations.csv data into stations table
sudo -u postgres psql -d postgres --user=postgres -c "\copy stations FROM stations.csv DELIMITER ',' CSV HEADER";

# Create trips table
sudo -u postgres psql -d postgres --user=postgres -c "CREATE TABLE trips(
    id SERIAL PRIMARY KEY,
    departure_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    return_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    departure_station INTEGER NOT NULL,
    return_station INTEGER NOT NULL,
    distance REAL NOT NULL,
    duration INTEGER NOT NULL,

    FOREIGN KEY(departure_station) REFERENCES stations(id),
    FOREIGN KEY(return_station) REFERENCES stations(id),
);"

# Create temporary table to hold trips.csv data
sudo -u postgres psql -d postgres --user=postgres -c "CREATE TABLE tmp(
  departure_time text,
  return_time text,
  departure_station text,
  return_station text,
  distance text,
  duration text
);"

# Copy trips.csv data into temporary table
sudo -u postgres psql -d postgres --user=postgres -c "\copy tmp FROM trips.csv DELIMITER ',' CSV HEADER";

# Insert trips data into trips table, casting the data types properly
sudo -u postgres psql -d postgres --user=postgres -c "INSERT INTO trips(departure_time, return_time, departure_station, return_station, distance, duration)
  SELECT TO_TIMESTAMP(departure_time, 'YYYY-MM-DDTHH24:MI:SS'),
   TO_TIMESTAMP(return_time, 'YYYY-MM-DDTHH24:MI:SS'),
   departure_station::INT,
   return_station::INT,
   distance::REAL,
   duration::INT
  FROM tmp;"

sudo -u postgres psql -d postgres --user=postgres -c "DROP TABLE tmp;"

# Cleanup all csv files
rm -rf *.csv