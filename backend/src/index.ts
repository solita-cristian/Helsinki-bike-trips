import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {AppDataSource} from "./database";
import logging from "logging";
import {DatabaseLogger} from "./logger";
import {stations} from "./models/stations";
import {trips} from "./models/trips";
import app from "./server";

dotenv.config()

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

AppDataSource.initialize()
    .then(async () => {
        DatabaseLogger.debug('Data source initialised correctly')
    })
    .catch((e) => {
        DatabaseLogger.error(`Data source could not be initialised. ${e}`)
    })