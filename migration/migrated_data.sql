CREATE TABLE stations(
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
);

\copy stations FROM stations.csv DELIMITER ',' CSV HEADER;

CREATE TABLE trips(
    id SERIAL PRIMARY KEY,
    departure_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    return_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    departure_station INTEGER NOT NULL,
    return_station INTEGER NOT NULL,
    distance REAL NOT NULL,
    duration INTEGER NOT NULL,

    FOREIGN KEY(departure_station) REFERENCES stations(id),
    FOREIGN KEY(return_station) REFERENCES stations(id)
);

CREATE TABLE tmp(
  departure_time text,
  return_time text,
  departure_station text,
  return_station text,
  distance text,
  duration text
);

\copy tmp FROM trips.csv DELIMITER ',' CSV HEADER;

INSERT INTO trips(departure_time, return_time, departure_station, return_station, distance, duration)
  SELECT TO_TIMESTAMP(departure_time, 'YYYY-MM-DDTHH24:MI:SS'),
   TO_TIMESTAMP(return_time, 'YYYY-MM-DDTHH24:MI:SS'),
   departure_station::INT,
   return_station::INT,
   distance::REAL,
   duration::INT
  FROM tmp;

DROP TABLE tmp;