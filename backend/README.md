# Backend service

This service is responsible for exposing an API that will fetch the required data from the database and send it to the 
frontend service.

## Getting started

This service is meant to be run in `docker`. See top-level README.md for more information.

## Stack

The stack of the service is:

- Typescript
- NodeJs
- Express for creating and managing routes
- TypeORM for intefacing with and modelling the database
- Jest for testing
- Swagger for defining the routes' schemas

### API routes

The API routes are generated starting from the `yaml` files inside `src/api/spec`. There files respect the Swagger 2.0 specification, which tells how a route is composed, its query string and parameters, as well as the response type and composition.

Using the library `swagger-routes-express`, it was possible to avoid the classic `express` boilerplate, and focus on writing the business logic of the request and simply export it in `src/api/index.ts`, where they will be linked to the routes specified in the `yaml` files.

Going to the route `/api-docs`, there is a Swagger UI interface where it is possible to test and check the routes.

### Controllers

Each route has its unique controller, which is just a class that will contain the business logic of the requests. Due to `swagger-routes-express` being limited, to make it work it was necessary to instanciate the controller and export the necessary method, renaming them according to the `operationId` field in the spec files.

### Testing

The testing is done using `jest`.
