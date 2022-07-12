import csv
import glob
from typing import Set, Dict, Union

stations_file = "stations.csv"
trip_files = glob.glob("2021-*.csv")

trips_header = [
    "departure_time",
    "return_time",
    "departure_station",
    "return_station",
    "distance",
    "duration",
]

stations_header = [
    "fid",
    "id",
    "name_fi",
    "name_se",
    "name_en",
    "address_fi",
    "address_se",
    "city_fi",
    "city_se",
    "operator",
    "capacity",
    "x",
    "y",
]

stations_ids: Set[int] = set()
stations = []

# Read all stations and override the header
with open(stations_file, mode="r") as s:
    rows = csv.DictReader(s)

    for r in rows:
        stations_ids.add(r["ID"])
        stations.append({
            "fid": r["\ufeffFID"],
            "id": r["ID"],
            "name_fi": r["Nimi"],
            "name_se": r["Namn"],
            "name_en": r["Name"],
            "address_fi": r["Osoite"],
            "address_se": r["Adress"],
            "city_fi": r["Kaupunki"],
            "city_se": r["Stad"],
            "operator": r["Operaattor"],
            "capacity": r["Kapasiteet"],
            "x": r["x"],
            "y": r["y"],
        })

with open(stations_file, mode="w") as s:
    writer = csv.DictWriter(s, fieldnames=stations_header)
    writer.writeheader()
    writer.writerows(stations)


with open("trips.csv", mode="w") as ts:
    trips = csv.DictWriter(ts, fieldnames=trips_header)
    trips.writeheader()

    for trip in trip_files:
        with open(trip, mode="r") as t:
            rows = csv.DictReader(t)

            for r in rows:
                distance = r["Covered distance (m)"]
                duration = r["Duration (sec.)"]
                if distance and \
                    duration and \
                    float(distance) >= 10 and \
                    int(duration) >= 10 and \
                    r["Departure station id"] in stations_ids and \
                    r["Return station id"] in stations_ids:
                    trips.writerow({
                        "departure_time": r["\ufeffDeparture"],
                        "return_time": r["Return"],
                        "departure_station": r["Departure station id"],
                        "return_station": r["Return station id"],
                        "distance": distance,
                        "duration": duration,
                    })