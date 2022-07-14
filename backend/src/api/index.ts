import {Request, Response} from "express";
import {getAllStations, getStation} from './controllers/stations/stations'

module.exports = { getAllStations, getStation };