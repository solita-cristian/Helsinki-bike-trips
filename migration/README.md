# Migration service

This service is responsible for fetching the CSV files from the web, validate them and migrate them to a `postgresql` database.

## Getting started

The service is meant to run on `docker`. See top-level README.md for more details.

## Functionality

The script's execution can be divided into three parts:

1. CSV fetching
2. CSV validation and cleanup
3. Database migration

### CSV fetching

The CSV fetching process will use cURL to directly download the CSV files from the given links and save them in with an 
easy-to-read name.

### CSV validation and cleanup

The validation and cleanup process is made using plain python with the builtin `csv` library.
The process flows as follows:

1. Read the stations CSV file and modify its header for better readability in the database
2. Read each trips CSV file, iterate each row and write into a new file only the valid CSV rows

A valid trips CSV row will:

- Have `distance >= 10`
- Have `duration >= 10`
- Have non `null` fields
- Have `departure_station` and `return_station` ids match with one station in the stations CSV file.

## Database migration

The last step is to migrate the CSV files into a `postresql 12` database.

The database is composed of two tables: `stations` and `trips`.

### Stations table

The station table `sql` code look as follows:

```sql
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
```

### Trips table

The trips table `sql` code looks as follows:
 
```sql
CREATE TABLE trips(
    id SERIAL PRIMARY KEY,
    departure_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    return_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    departure_station INTEGER NOT NULL,
    return_station INTEGER NOT NULL,
    distance REAL NOT NULL,
    duration INTEGER NOT NULL,

    FOREIGN KEY(departure_station) REFERENCES stations(id),
    FOREIGN KEY(return_station) REFERENCES stations(id),
);
```

When migrating a temporary table is created since the postgresql `\COPY` command cannot properly format timestamps,
so the data needs to be copied in text format, and then inserted into the actual table, with a little time loss.
