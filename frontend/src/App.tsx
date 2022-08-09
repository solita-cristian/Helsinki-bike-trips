import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Stations from './components/stations/Stations';
import StationPage from './components/stations/station/Station';
import Trips from './components/trips/Trips';

function App() {
  return (

    <><BrowserRouter>
      <Routes>
      <Route path='/' element={<App />} />
      <Route path='/stations' element={<Stations />} />
      <Route path='/trips' element={<Trips />} />
      <Route path='/stations/:id' element={<StationPage />} />
      </Routes>
    </BrowserRouter><div className="App">
      </div></>
  );
}

export default App;
