# Frontend service

This service is responsible for showing the data to the user through a web page.

## Getting started

This service is meant to be run in `docker`. See top-level README.md for more information.

## Stack

The stack of the service is:

- ReactJS + Typescript
- MaterialUI as styling base
- Axios for making requests
- ReactRouter for routing
- Leaflet for showing the map

## Routes

There are 3 routes: 

- `/stations`, used to show and search all stations
- `/trips`, used to show and search trips
- `/stations/:id` used to show detailed data for a particular station based on its `id`

### Stations

The `/stations` route displays a page of variable amount of stations in a table, and can be searched using a form that will perform a new request and update the table component accordingly.

### Station

The `/station/:id` route displays detailed data about a specific station. This data is:

- Name and address
- The total number of trips starting and ending at the specific station
- The average distance of the trips starting and ending at the specific station
- The 5 most common starting and ending stations for trips starting or ending at the specific station
- The location on the map

### Trips

The `/trips` route functions exactly like the `/stations` route, except that it will request trips instead of stations.

## TODO

- [ ] Allow trips to be searched using a range of date times
- [ ] Lower complexity by moving to a more modern framework like [Svelte](https://svelte.dev/)
