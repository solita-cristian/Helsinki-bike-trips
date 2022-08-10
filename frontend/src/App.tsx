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
import Header from './components/template/Header';
import Home from './components/template/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className='app'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/stations' element={<Stations />} />
            <Route path='/trips' element={<Trips />} />
            <Route path='/stations/:id' element={<StationPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
