# Data fetching

#Fetching the stations CSV file
curl --request GET -fL \
  --url "https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv" \
  --output "stations.csv"

#Fetching the trips CSV file
curl --request GET -fL \
  --url "https://dev.hsl.fi/citybikes/od-trips-2021/2021-{05,06,07}.csv" \
  --output "2021-#1.csv"