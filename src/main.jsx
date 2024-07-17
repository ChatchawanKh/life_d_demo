import React from 'react'
import ReactDOM from 'react-dom/client'
// import './index.css'
import Map from './Component/Map.jsx'
// import Sidebar from './Component/Sidebar.jsx'
// import Sidebar from './Component/Sidebar_edt.jsx'
import Sidebar from './Component/Sidebar_3.jsx'
import MediaCard from './Component/Card.jsx'
// import Searchbar from './Component/Searchbar.jsx'



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <Searchbar /> */}
    <MediaCard />
    <Sidebar />
    <Map />
  </React.StrictMode>,
)
