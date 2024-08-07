import React from 'react'
import ReactDOM from 'react-dom/client'
// import Map from './Component/Map.jsx'
import Map from './Component/MapHeat.jsx'
import MediaCard from './Component/Card.jsx'
import DateControl from './Component/DateControl.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Dashboard /> */}
    {/* <Sidebar /> */}
    <DateControl />
    <MediaCard />
    <Map />
  </React.StrictMode>,
)
