# Helsinki-bike-trips
This project is done as a pre-assignment for Solita web academy Fall 2022.

The main goal of this project is to fetch bike trips and stations from public sources as csv files, clean and insert them into a database,
show and allow the user to filter the data.

## Getting started

This project is meant to be run using `docker` and `docker-compose`, as to create a platform agnostic and standardized environment.
To install `docker` and `docker-compose` follow this [guide](https://docs.docker.com/get-docker/) for your specific platform.

After you have installed `docker` successfully, you need a `.env` file that contains sensitive but necessary data to allow the application to run correctly.
The `.env` file must be put in the root directory of the project, since `docker-compose` expects it to the at the same level as the `docker-compose.yaml` file,
and must look like this:

```sh
DB_USER=<USERNAME>
DB_PASSWORD=<PASSWORD>
```

The username and passwords can be whatever you like, since a new user will be created when building the database service.

## Services

This project is made out of 3 services:

- Migration will host the database and perform any preliminary actions on the csv files
- Backend will host a NodeJS+Express application which will expose an API for the frontend
- Frontend will host a ReactJS application which will show the data coming from the backend in a user friendly manner

**For more information about the individual services, there are separate README.md files in each of the services' root directories.**

## Docker compose stack

The `docker-compose.yaml` file tells docker how to build and connect each of the services. In this case each service is built using a specific `Dockerfile`, which can be found in the specific service root directory.

Each service container exposes a default port, which are:

- For the backend `8080`
- For the frontend `3000`
- For the database the postgresql default `5432`

So, going to `http://localhost:$PORT/` will take you to the service's home page, if exists, based on the value of `$PORT`.
