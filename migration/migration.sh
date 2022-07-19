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

echo "postgres:$DB_PASSWORD"|chpasswd

# Start postgresql service
service postgresql start
service postgresql status

psql "postgresql://$DB_USER:$DB_PASSWORD@localhost/postgres" < migrated_data.sql

# Cleanup all csv files
rm -rf *.csv

# Start and listen postgresql service with configuration
service postgresql stop
echo "$DB_PASSWORD" | sudo -S -u postgres /usr/lib/postgresql/12/bin/postgres -D /var/lib/postgresql/12/main -c config_file=/etc/postgresql/12/main/postgresql.conf