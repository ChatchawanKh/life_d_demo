/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import "./MapHeat.css"
import { renderToString } from 'react-dom/server';
// import { styled, css } from '@mui/system';

//Mui infra
import {
    List, ListItemButton, Box, Chip,
    Stack, Typography, CardContent, CardActions, Button
} from "@mui/material";
import Zoom from '@mui/material/Zoom';
import Tooltip from '@mui/material/Tooltip';
import { Popper } from '@mui/base/Popper';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Vaccines from '@mui/icons-material/Vaccines';
import MedicalInformation from '@mui/icons-material/MedicalInformation';
import InfoIcon from '@mui/icons-material/Info';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
// import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

//Icon
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
// import CircularProgress from '@mui/material/CircularProgress';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LayersIcon from '@mui/icons-material/Layers';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Street from '/src/Icon/street.svg'
import Satt from '/src/Icon/satt.svg'
import ClearIcon from '@mui/icons-material/Clear';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import GoogleIcon from '@mui/icons-material/Google';
// import THsvg from '/src/Icon/thailand.svg'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import Tmd from '/src/Icon/meteo.png'




const Map = () => {
    const mapRef = useRef(null);
    const sphereMapRef = useRef(null);

    const [isPM25Checked, setIsPM25Checked] = useState(true);
    const [pm25wmsLayer, setPm25wmsLayer] = useState(null);
    const [pm25ClickHandler, setPm25ClickHandler] = useState(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://api.sphere.gistda.or.th/map/?key=test2022";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            var sphere = window.sphere
            var map = new window.sphere.Map({
                placeholder: mapRef.current,
            });
            sphereMapRef.current = map;

            map.Event.bind(sphere.EventName.Ready, async function () {
                map.Ui.Geolocation.visible(false);
                map.Ui.Fullscreen.visible(false);
                map.Ui.DPad.visible(false);
                map.Ui.Zoombar.visible(false);
                map.Ui.Toolbar.visible(false);
                map.Ui.Scale.visible(false);
                map.Ui.LayerSelector.visible(false);

                if (isPM25Checked) {
                    const pm25wms = new sphere.Layer('0', {
                        type: sphere.LayerType.WMS,
                        url: "https://service-proxy-765rkyfg3q-as.a.run.app/api_geoserver/geoserver/pm25_hourly_raster_24hr/wms",
                        zoomRange: { min: 1, max: 15 },
                        zIndex: 5,
                        opacity: 1,
                        id: 'layer_24pm25'
                    });
                    map.Layers.add(pm25wms);
                    setPm25wmsLayer(pm25wms);

                    const handleMapClick = (location) => {
                        const lat = location.lat;
                        const lon = location.lon;

                        axios.get(`https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${lat}&lng=${lon}`)
                            .then(response => {
                                const data = response.data.data;
                                const pm25 = data['pm25'];
                                const tb = data.loc['tb_tn'];
                                const ap = data.loc['ap_tn'];
                                const pv = data.loc['pv_tn'];
                                const date = data.datetimeThai['dateThai'];
                                const time = data.datetimeThai['timeThai'];

                                let color;
                                let level;
                                if (pm25 < 15) {
                                    color = '#4FAFBF';
                                    level = 'ดีมาก';
                                } else if (pm25 > 15 && pm25 <= 25) {
                                    color = '#9FCF62';
                                    level = 'ดี';
                                } else if (pm25 > 25 && pm25 <= 37.5) {
                                    color = '#F1E151';
                                    level = 'ปานกลาง';
                                } else if (pm25 > 37.5 && pm25 <= 75) {
                                    color = '#F1A53B';
                                    level = 'เริ่มมีผล';
                                } else {
                                    color = '#EB4E47';
                                    level = 'มีผล';
                                }

                                const pm25Formatted = pm25.toFixed(2);

                                const loadingHtml = `
                                            <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
                                                <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
                                                <span style="font-size: 14px;">กำลังค้นหาข้อมูล...</span>
                                            </div>
                                            <style>
                                                @keyframes spin {
                                                    0% { transform: rotate(0deg); }
                                                    100% { transform: rotate(360deg); }
                                                }
                                            </style>
                                        `;

                                const popupDetail = `
                                        <div style="padding:0.5rem;">
                                            <span id="location" style="font-size: 16px; font-weight: bold;">${tb} ${ap} ${pv}</span><br />
                                            <span style="font-size: 14px;">สภาพอากาศวันนี้</span><br />
                                            <span style="font-size: 12px;">ค่า PM2.5</span><br />
                                            <span id='value' style={{ fontWeight: 'bold', fontSize: '30px' }}><span style="color: ${color}; font-weight: bold; font-size: 30px;">${pm25Formatted} </span></span>
                                            <span style="font-size: 10px;">µg./m3</span>
                                            <span id="level"><span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span><br />
                                            <span id="update" style="font-size: 12px; color: #a6a6a6;">อัพเดทล่าสุด ${date} ${time}</span>
                                        </div>
                                    `;

                                var popUp = new sphere.Popup({ lon: lon, lat: lat }, {
                                    title: `
                                        <span style='font-weight: 500; margin-left: 0.5rem;'> ตำแหน่งที่สนใจ</span>
                                        <span style='font-weight: 400; color: #a6a6a6;'>
                                            ${lat.toFixed(4)}, ${lon.toFixed(4)}
                                        </span>
                                    `
                                    ,
                                    detail: loadingHtml,
                                    loadDetail: updateDetail,
                                    size: { width: '100%' },
                                    closable: true
                                });

                                function updateDetail(element) {
                                    setTimeout(function () {
                                        element.innerHTML = popupDetail;
                                    }, 1000);
                                }
                                map.Overlays.add(popUp);
                            });
                    };

                    map.Event.bind(sphere.EventName.Click, handleMapClick);
                    setPm25ClickHandler(() => handleMapClick);

                } else {
                    if (pm25wmsLayer) {
                        map.Layers.remove(pm25wmsLayer);
                        setPm25wmsLayer(null);
                    }

                    if (pm25ClickHandler) {
                        map.Event.unbind(sphere.EventName.Click, pm25ClickHandler);
                        setPm25ClickHandler(null);
                    }
                }

                const getLoc = () => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;

                            axios.get(`https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${latitude}&lng=${longitude}`)
                                .then(response => {
                                    const data = response.data.data
                                    const tb = data.loc['tb_tn']
                                    const ap = data.loc['ap_tn']

                                    const pv = data.loc['pv_tn']

                                    const pm25 = data['pm25']

                                    // update sect
                                    const date = data.datetimeThai['dateThai']
                                    const time = data.datetimeThai['timeThai']

                                    // update sect
                                    document.getElementById('location').innerHTML = `${tb} ${ap} ${pv}`;
                                    document.getElementById('update').innerHTML = `อัพเดทล่าสุด ${date} ${time}`;

                                    ///////////////////////////////////////////////////////////////////////////////////////////////
                                    ///////////////////////////////////////// Text Color  /////////////////////////////////////////
                                    ///////////////////////////////////////////////////////////////////////////////////////////////
                                    let color;
                                    if (pm25 < 15) {
                                        color = '#4FAFBF'; // Very Good air quality
                                    } else if (pm25 > 15 && pm25 <= 25) {
                                        color = '#9FCF62';
                                    } else if (pm25 > 25 && pm25 <= 37.5) {
                                        color = '#F1E151'; // Good
                                    } else if (pm25 > 37.5 && pm25 <= 75) {
                                        color = '#F1A53B'; // Moderate
                                    } else {
                                        color = '#EB4E47'; // Unhealthy for sensitive group
                                    }

                                    let level;
                                    if (pm25 < 15) {
                                        level = 'ดีมาก'; // Very Good air quality
                                    } else if (pm25 > 15 && pm25 <= 25) {
                                        level = 'ดี';
                                    } else if (pm25 > 25 && pm25 <= 37.5) {
                                        level = 'ปานกลาง'; // Good
                                    } else if (pm25 > 37.5 && pm25 <= 75) {
                                        level = 'เริ่มมีผล'; // Moderate
                                    } else {
                                        level = 'มีผล'; // Unhealthy for sensitive group
                                    }
                                    ///////////////////////////////////////////////////////////////////////////////////////////////
                                    ///////////////////////////////////////// Text Color  /////////////////////////////////////////
                                    ///////////////////////////////////////////////////////////////////////////////////////////////

                                    const pm25Formatted = pm25.toFixed(2);
                                    const valueElement = document.getElementById('value');
                                    valueElement.innerHTML = `
                                                                <span style="font-size: 12px; font-weight: 500;">ค่า PM2.5</span>
                                                                <br />
                                                                <span style="color: ${color};">
                                                                    ${pm25Formatted} <span style="font-size: 10px; font-weight: 500; color: #000;">µg./m³</span>
                                                                </span>
                                                            `;
                                    document.getElementById('level').innerHTML = `<span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span>`


                                    const encodedPv = encodeURIComponent(pv);
                                    // console.log(encodedPv);

                                    axios.get(`https://www.tmd.go.th/api/WeatherForecast7Day/weather-forecast-7day-by-province`, {
                                        params: {
                                            Sorting: 'weatherForecast7Day.recordTime asc',
                                            FilterText: encodedPv,
                                            MaxResultCount: 7,
                                            culture: 'th-TH'
                                        }
                                    })
                                        .then(response => {
                                            console.log(response.data);
                                        })
                                        .catch(error => {
                                            if (error.response) {
                                                // The server responded with a status code outside the 2xx range
                                                console.log('Error response:', error.response);
                                            } else if (error.request) {
                                                // The request was made but no response was received
                                                console.log('Error request:', error.request);
                                            } else {
                                                // Something happened in setting up the request that triggered an error
                                                console.log('Error message:', error.message);
                                            }
                                        });
                                })
                        }
                    );
                };

                const clickButtonWithTitle = (title) => {
                    const buttons = document.querySelectorAll('.maplibregl-ctrl-geolocate.mapboxgl-ctrl-geolocate');

                    buttons.forEach(button => {
                        if (button.getAttribute('title') === title) {
                            button.click();
                        }

                    });
                };
                getLoc();
                clickButtonWithTitle('Find my location');
            });
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const handlePM25Toggle = (e) => {
    //     const sphere = window.sphere;
    //     const map = sphereMapRef.current;

    //     const isChecked = e.target.checked;
    //     setIsPM25Checked(isChecked);

    //     if (isChecked) {
    //         console.log('Adding PM2.5 WMS layer');
    //         const pm25wms = new sphere.Layer('0', {
    //             type: sphere.LayerType.WMS,
    //             url: "https://service-proxy-765rkyfg3q-as.a.run.app/api_geoserver/geoserver/pm25_hourly_raster_24hr/wms",
    //             zoomRange: { min: 1, max: 15 },
    //             zIndex: 5,
    //             opacity: 1,
    //             id: 'layer_24pm25'
    //         });
    //         map.Layers.add(pm25wms);
    //         setPm25wmsLayer(pm25wms);

    //         const handleMapClick = (location) => {
    //             const lat = location.lat;
    //             const lon = location.lon;

    //             axios.get(`https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${lat}&lng=${lon}`)
    //                 .then(response => {
    //                     const data = response.data.data;
    //                     const pm25 = data['pm25'];
    //                     const tb = data.loc['tb_tn'];
    //                     const ap = data.loc['ap_tn'];
    //                     const pv = data.loc['pv_tn'];
    //                     const date = data.datetimeThai['dateThai'];
    //                     const time = data.datetimeThai['timeThai'];

    //                     let color;
    //                     let level;
    //                     if (pm25 < 15) {
    //                         color = '#4FAFBF';
    //                         level = 'ดีมาก';
    //                     } else if (pm25 > 15 && pm25 <= 25) {
    //                         color = '#9FCF62';
    //                         level = 'ดี';
    //                     } else if (pm25 > 25 && pm25 <= 37.5) {
    //                         color = '#F1E151';
    //                         level = 'ปานกลาง';
    //                     } else if (pm25 > 37.5 && pm25 <= 75) {
    //                         color = '#F1A53B';
    //                         level = 'เริ่มมีผล';
    //                     } else {
    //                         color = '#EB4E47';
    //                         level = 'มีผล';
    //                     }

    //                     const pm25Formatted = pm25.toFixed(2);

    //                     const loadingHtml = `
    //                                 <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
    //                                     <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
    //                                     <span style="font-size: 14px;">กำลังค้นหาข้อมูล...</span>
    //                                 </div>
    //                                 <style>
    //                                     @keyframes spin {
    //                                         0% { transform: rotate(0deg); }
    //                                         100% { transform: rotate(360deg); }
    //                                     }
    //                                 </style>
    //                             `;

    //                     const popupDetail = `
    //                             <div style="padding:0.5rem;">
    //                                 <span id="location" style="font-size: 16px; font-weight: bold;">${tb} ${ap} ${pv}</span><br />
    //                                 <span style="font-size: 14px;">สภาพอากาศวันนี้</span><br />
    //                                 <span style="font-size: 12px;">ค่า PM2.5</span><br />
    //                                 <span id='value' style={{ fontWeight: 'bold', fontSize: '30px' }}><span style="color: ${color}; font-weight: bold; font-size: 30px;">${pm25Formatted} </span></span>
    //                                 <span style="font-size: 10px;">µg./m3</span>
    //                                 <span id="level"><span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span><br />
    //                                 <span id="update" style="font-size: 12px; color: #a6a6a6;">อัพเดทล่าสุด ${date} ${time}</span>
    //                             </div>
    //                         `;

    //                     var popUp = new sphere.Popup({ lon: lon, lat: lat }, {
    //                         title: `
    //                             <span style='font-weight: 500; margin-left: 0.5rem;'> ตำแหน่งที่สนใจ</span>
    //                             <span style='font-weight: 400; color: #a6a6a6;'>
    //                                 ${lat.toFixed(4)}, ${lon.toFixed(4)}
    //                             </span>
    //                         `
    //                         ,
    //                         detail: loadingHtml,
    //                         loadDetail: updateDetail,
    //                         size: { width: '100%' },
    //                         closable: true
    //                     });

    //                     function updateDetail(element) {
    //                         setTimeout(function () {
    //                             element.innerHTML = popupDetail;
    //                         }, 1000);
    //                     }
    //                     map.Overlays.add(popUp);
    //                 });
    //         };

    //         map.Event.bind(sphere.EventName.Click, handleMapClick);
    //         setPm25ClickHandler(() => handleMapClick);

    //     } else {
    //         if (pm25wmsLayer) {
    //             map.Layers.remove(pm25wmsLayer);
    //             setPm25wmsLayer(null);
    //         }

    //         if (pm25ClickHandler) {
    //             map.Event.unbind(sphere.EventName.Click, pm25ClickHandler);
    //             setPm25ClickHandler(null);
    //         }
    //     }
    // };

    // const handlePM25Toggle = (event) => {
    //     setIsPM25Checked(event.target.checked);
    //     const sphere = window.sphere;
    //     const map = sphereMapRef.current;

    //     if (event.target.checked) {
    //         const pm25wms = new sphere.Layer('0', {
    //             type: sphere.LayerType.WMS,
    //             url: "https://service-proxy-765rkyfg3q-as.a.run.app/api_geoserver/geoserver/pm25_hourly_raster_24hr/wms",
    //             zoomRange: { min: 1, max: 15 },
    //             zIndex: 5,
    //             opacity: 1,
    //             id: 'layer_24pm25'
    //         });
    //         map.Layers.add(pm25wms);
    //         setPm25wmsLayer(pm25wms);


    //         //Add Popup Event
    //         map.Event.bind(sphere.EventName.Click, function (location) {
    //             // console.log(location);

    //             // Assuming location has lat and lon properties
    //             var lat = location.lat;
    //             var lon = location.lon;

    //             axios.get(`https://pm25.gistda.or.th/rest/getPm25byLocation?lat=${lat}&lng=${lon}`)
    //                 .then(response => {
    //                     const data = response.data.data
    //                     const tb = data.loc['tb_tn']
    //                     const ap = data.loc['ap_tn']

    //                     const pv = data.loc['pv_tn']

    //                     const pm25 = data['pm25']

    //                     // update sect
    //                     const date = data.datetimeThai['dateThai']
    //                     const time = data.datetimeThai['timeThai']

    //                     ///////////////////////////////////////////////////////////////////////////////////////////////
    //                     ///////////////////////////////////////// Text Color  /////////////////////////////////////////
    //                     ///////////////////////////////////////////////////////////////////////////////////////////////
    //                     let color;
    //                     if (pm25 < 15) {
    //                         color = '#4FAFBF'; // Very Good air quality
    //                     } else if (pm25 > 15 && pm25 <= 25) {
    //                         color = '#9FCF62';
    //                     } else if (pm25 > 25 && pm25 <= 37.5) {
    //                         color = '#F1E151'; // Good
    //                     } else if (pm25 > 37.5 && pm25 <= 75) {
    //                         color = '#F1A53B'; // Moderate
    //                     } else {
    //                         color = '#EB4E47'; // Unhealthy for sensitive group
    //                     }

    //                     let level;
    //                     if (pm25 < 15) {
    //                         level = 'ดีมาก'; // Very Good air quality
    //                     } else if (pm25 > 15 && pm25 <= 25) {
    //                         level = 'ดี';
    //                     } else if (pm25 > 25 && pm25 <= 37.5) {
    //                         level = 'ปานกลาง'; // Good
    //                     } else if (pm25 > 37.5 && pm25 <= 75) {
    //                         level = 'เริ่มมีผล'; // Moderate
    //                     } else {
    //                         level = 'มีผล'; // Unhealthy for sensitive group
    //                     }
    //                     ///////////////////////////////////////////////////////////////////////////////////////////////
    //                     ///////////////////////////////////////// Text Color  /////////////////////////////////////////
    //                     ///////////////////////////////////////////////////////////////////////////////////////////////

    //                     const pm25Formatted = pm25.toFixed(2);

    //                     const loadingHtml = `
    //                                 <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
    //                                     <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
    //                                     <span style="font-size: 14px;">กำลังค้นหาข้อมูล...</span>
    //                                 </div>
    //                                 <style>
    //                                     @keyframes spin {
    //                                         0% { transform: rotate(0deg); }
    //                                         100% { transform: rotate(360deg); }
    //                                     }
    //                                 </style>
    //                             `;

    //                     const popupDetail = `
    //                             <div style="padding:0.5rem;">
    //                                 <span id="location" style="font-size: 16px; font-weight: bold;">${tb} ${ap} ${pv}</span><br />
    //                                 <span style="font-size: 14px;">สภาพอากาศวันนี้</span><br />
    //                                 <span style="font-size: 12px;">ค่า PM2.5</span><br />
    //                                 <span id='value' style={{ fontWeight: 'bold', fontSize: '30px' }}><span style="color: ${color}; font-weight: bold; font-size: 30px;">${pm25Formatted} </span></span>
    //                                 <span style="font-size: 10px;">µg./m3</span>
    //                                 <span id="level"><span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span><br />
    //                                 <span id="update" style="font-size: 12px; color: #a6a6a6;">อัพเดทล่าสุด ${date} ${time}</span>
    //                             </div>
    //                         `;

    //                     var popUp = new sphere.Popup({ lon: lon, lat: lat }, {
    //                         title: `
    //                             <span style='font-weight: 500; margin-left: 0.5rem;'> ตำแหน่งที่สนใจ</span>
    //                             <span style='font-weight: 400; color: #a6a6a6;'>
    //                                 ${lat.toFixed(4)}, ${lon.toFixed(4)} (Lat, Lon)
    //                             </span>
    //                         `
    //                         ,
    //                         detail: loadingHtml,
    //                         loadDetail: updateDetail,
    //                         size: { width: '100%' },
    //                         closable: true
    //                     });

    //                     function updateDetail(element) {
    //                         setTimeout(function () {
    //                             element.innerHTML = popupDetail;
    //                         }, 1000);
    //                     }


    //                     map.Overlays.add(popUp);
    //                 });

    //         });

    //     } else {
    //         if (pm25wmsLayer) {
    //             map.Layers.remove(pm25wmsLayer);
    //             setPm25wmsLayer(null);
    //         }
    //     }
    // };



    let loadingCardAdded = false;
    const insertAllhospital = async () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();

        // Function to show the loading card
        const showLoadingCard = () => {
            if (loadingCardAdded) {
                return; // Prevent adding the loading card again
            }

            const loadingAllHtml = `
            <div class="all" style="
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                padding: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    border: 3px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 3px solid #3498db;
                    width: 24px;
                    height: 24px;
                    animation: spin 1s linear infinite;
                    margin-right: 8px;
                "></div>
                <span style="font-size: 14px;">กำลังค้นหาสถานพยาบาลทั้งหมดใกล้ฉัน...</span>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;

            document.body.insertAdjacentHTML('beforeend', loadingAllHtml);
            loadingCardAdded = true;

            // Remove the loading card after a delay
            setTimeout(() => {
                const loadingCardAllElements = document.getElementsByClassName('all');
                while (loadingCardAllElements.length > 0) {
                    loadingCardAllElements[0].remove();
                }
                loadingCardAdded = false;
            }, 4500);
        };

        showLoadingCard();

        await Promise.all([
            insertHospital(),
            insertClinic(),
            insertHealthSt()
        ]);
    };


    const insertHospital = async () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();

        const loadingHtml = `
            <div id="loading-card" style="position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); z-index: 15; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
                    <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
                    <span style="font-size: 14px;">กำลังค้นหาโรงพยาบาลใกล้ฉัน...</span>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHtml);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const poiResponse = await axios.get(`https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=โรงพยาบาล&key=test2022`);
                const responseData = poiResponse.data.data;
                console.log(responseData);

                const routePromises = responseData.map(async (item) => {
                    const { lat, lon } = item;

                    try {
                        const routeResponse = await axios.get(`https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=test2022`);
                        return routeResponse.data.data.distance;
                    } catch (error) {
                        console.error('Error fetching route data:', error);
                        return null;
                    }
                });

                const distances = await Promise.all(routePromises);

                responseData.forEach((item, index) => {
                    const { lat, lon, name, address, tel } = item;
                    const distance = distances[index];

                    const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                    const whereMapUrl = `https://where.gistda.or.th/route?dir=${latitude}-${longitude},${lat}-${lon}&result=true&swipe=1`;

                    const cardHtml = renderToString(
                        <CardContent
                            spacing={1}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                transition: 'opacity 0.3s',
                                display: 'flex',
                                whiteSpace: 'nowrap',
                                borderRadius: '5px',
                                padding: '20px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                border: '2px solid #FF6968',
                            }}
                        >
                            <Typography component="div">
                                <Box style={{ fontWeight: 'bold', margin: 1 }}>{name}</Box>
                                <Box style={{ fontWeight: 'light', margin: 1 }}>{address}</Box>
                                <Box
                                    sx={{
                                        fontWeight: 'light',
                                        m: 1,
                                        color: '#FF6968',
                                        verticalAlign: 'middle',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {tel && (
                                        <>
                                            <PhoneIcon style={{ color: '#FF6968', width: '20px', verticalAlign: 'middle' }} />
                                            &nbsp;{tel}
                                            <br />
                                        </>
                                    )}
                                </Box>
                                {distance !== null && (
                                    <Box style={{ fontWeight: 'light', margin: 1 }}>
                                        <StraightenIcon style={{ color: '#FF6968', width: '20px', verticalAlign: 'middle' }} />
                                        &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                                    </Box>
                                )}
                                <CardActions style={{ display: 'flex' }}>
                                    <Box style={{ display: 'flex', margin: '5px' }}>
                                        <Button
                                            href={whereMapUrl}
                                            target="_blank"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: '180px',
                                                height: '20px',
                                                padding: '0.5rem',
                                                borderRadius: '15px',
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <img
                                                src="https://where.gistda.or.th/favicon.ico"
                                                alt="Favicon"
                                                style={{
                                                    width: '1.5em',
                                                    borderRadius: '50%',
                                                    padding: '2px',
                                                    boxShadow: 'inset 4px 4px 4px rgba(255, 255, 255, 0.7)',
                                                }}
                                            />
                                            <span style={{ margin: '10px', color: '#FF6968' }}>WHERE</span>
                                        </Button>
                                    </Box>
                                    <Box style={{ display: 'flex', margin: '5px' }}>
                                        <Button
                                            href={googleMapUrl}
                                            target="_blank"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: '180px',
                                                height: '20px',
                                                padding: '0.5rem',
                                                borderRadius: '15px',
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <GoogleIcon
                                                style={{
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    padding: '2px',
                                                    backgroundColor: '#FF6968',
                                                    boxShadow: 'inset 4px 4px 4px rgba(255, 255, 255, 0.7)',
                                                }}
                                            />
                                            <span style={{ margin: '10px', color: '#FF6968' }}>Google Map</span>
                                        </Button>
                                    </Box>
                                </CardActions>
                            </Typography>
                        </CardContent>
                    );

                    const iconHtml = renderToString(
                        <LocalHospitalIcon
                            style={{
                                color: 'white',
                                borderRadius: '50%',
                                backgroundColor: '#FF6968',
                                padding: '2px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    );

                    const markerHtml = `
                        <style>
                            .marker-container {
                                position: relative;
                                display: inline-block;
                                z-index: 20;
                            }
    
                            .card-container {
                                visibility: hidden;
                                z-index: 100;
                                top: -10em;
                                position: absolute;
                                left: 50%;
                                transform: translateX(-50%);
                                transition: 0.25s ease-in-out;
                            }
    
                            .marker-container:hover .card-container {
                                visibility: visible;
                                position: absolute;
                                z-index: 9999;
                            }
                        </style>
    
                        <div class='marker-container'>
                            <div class='marker-icon'>
                                ${iconHtml}
                            </div>
                            <div class='card-container'>
                                <div class='hover-card' style="z-index: 1000">
                                    ${cardHtml}
                                </div>
                            </div>
                        </div>
                    `;

                    const marker = new window.sphere.Marker(
                        { lat, lon },
                        {
                            icon: {
                                html: markerHtml,
                                offset: { x: 18, y: 21 },
                            },
                        }
                    );

                    map.Overlays.add(marker);
                });

                map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });

                const loadingCard = document.getElementById('loading-card');
                if (loadingCard) {
                    loadingCard.remove();
                }
            } catch (error) {
                console.error('Error fetching POI data:', error);

                const loadingCard = document.getElementById('loading-card');
                if (loadingCard) {
                    loadingCard.remove();
                }
            }
        });
    };

    const insertClinic = async () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();

        // Show the loading card
        const loadingHtml = `
            <div id="loading-card" style="position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); z-index: 15; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
                    <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
                    <span style="font-size: 14px;">กำลังค้นหาคลินิกใกล้ฉัน...</span>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHtml);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const poiResponse = await axios.get(`https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=Poly%20Clinic&key=test2022`);
                const responseData = poiResponse.data.data;
                console.log(responseData);

                const routePromises = responseData.map(async (item) => {
                    const { lat, lon } = item;

                    try {
                        const routeResponse = await axios.get(`https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=test2022`);
                        return routeResponse.data.data.distance;
                    } catch (error) {
                        console.error('Error fetching route data:', error);
                        return null;
                    }
                });

                const distances = await Promise.all(routePromises);

                responseData.forEach((item, index) => {
                    const { lat, lon, name, address, tel } = item;
                    const distance = distances[index];

                    const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                    const whereMapUrl = `https://where.gistda.or.th/route?dir=${latitude}-${longitude},${lat}-${lon}&result=true&swipe=1`;

                    const cardHtml = renderToString(
                        <CardContent
                            spacing={1}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                transition: 'opacity 0.3s',
                                display: 'flex',
                                whiteSpace: 'nowrap',
                                borderRadius: '5px',
                                padding: '20px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                border: '2px solid #1DBEB8',
                            }}
                        >
                            <Typography component="div">
                                <Box style={{ fontWeight: 'bold', margin: 1 }}>{name}</Box>
                                <Box style={{ fontWeight: 'light', margin: 1 }}>{address}</Box>
                                <Box
                                    sx={{
                                        fontWeight: 'light',
                                        m: 1,
                                        color: '#1DBEB8',
                                        verticalAlign: 'middle',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {tel && (
                                        <>
                                            <PhoneIcon style={{ color: '#1DBEB8', width: '20px', verticalAlign: 'middle' }} />
                                            &nbsp;{tel}
                                            <br />
                                        </>
                                    )}
                                </Box>
                                {distance !== null && (
                                    <Box style={{ fontWeight: 'light', margin: 1 }}>
                                        <StraightenIcon style={{ color: '#1DBEB8', width: '20px', verticalAlign: 'middle' }} />
                                        &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                                    </Box>
                                )}
                                <CardActions style={{ display: 'flex' }}>
                                    <Box style={{ display: 'flex', margin: '5px' }}>
                                        <Button
                                            href={whereMapUrl}
                                            target="_blank"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: '180px',
                                                height: '20px',
                                                padding: '0.5rem',
                                                borderRadius: '15px',
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <img
                                                src="https://where.gistda.or.th/favicon.ico"
                                                alt="Favicon"
                                                style={{
                                                    width: '1.5em',
                                                    borderRadius: '50%',
                                                    padding: '2px',
                                                    boxShadow: 'inset 4px 4px 4px rgba(255, 255, 255, 0.7)',
                                                }}
                                            />
                                            <span style={{ margin: '10px', color: '#1DBEB8' }}>WHERE</span>
                                        </Button>
                                    </Box>
                                    <Box style={{ display: 'flex', margin: '5px' }}>
                                        <Button
                                            href={googleMapUrl}
                                            target="_blank"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: '180px',
                                                height: '20px',
                                                padding: '0.5rem',
                                                borderRadius: '15px',
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <GoogleIcon
                                                style={{
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    padding: '2px',
                                                    backgroundColor: '#1DBEB8',
                                                    boxShadow: 'inset 4px 4px 4px rgba(255, 255, 255, 0.7)',
                                                }}
                                            />
                                            <span style={{ margin: '10px', color: '#1DBEB8' }}>Google Map</span>
                                        </Button>
                                    </Box>
                                </CardActions>
                            </Typography>
                        </CardContent>
                    );

                    const iconHtml = renderToString(
                        <Vaccines
                            style={{
                                color: 'white',
                                borderRadius: '50%',
                                backgroundColor: '#1DBEB8',
                                padding: '2px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    );

                    const markerHtml = `
                        <style>
                            .marker-container {
                                position: relative;
                                display: inline-block;
                                z-index: 20;
                            }
    
                            .card-container {
                                visibility: hidden;
                                z-index: 100;
                                top: -10em;
                                position: absolute;
                                left: 50%;
                                transform: translateX(-50%);
                                transition: 0.25s ease-in-out;
                            }
    
                            .marker-container:hover .card-container {
                                visibility: visible;
                                position: absolute;
                                z-index: 9999;
                            }
                        </style>
    
                        <div class='marker-container'>
                            <div class='marker-icon'>
                                ${iconHtml}
                            </div>
                            <div class='card-container'>
                                <div class='hover-card' style="z-index: 1000">
                                    ${cardHtml}
                                </div>
                            </div>
                        </div>
                    `;

                    const marker = new window.sphere.Marker(
                        { lat, lon },
                        {
                            icon: {
                                html: markerHtml,
                                offset: { x: 18, y: 21 },
                            },
                        }
                    );

                    map.Overlays.add(marker);
                });

                map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });

                // Remove the loading card once markers are added
                const loadingCard = document.getElementById('loading-card');
                if (loadingCard) {
                    loadingCard.remove();
                }
            } catch (error) {
                console.error('Error fetching POI data:', error);

                // Remove the loading card in case of an error
                const loadingCard = document.getElementById('loading-card');
                if (loadingCard) {
                    loadingCard.remove();
                }
            }
        });
    };

    const insertHealthSt = async () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();

        const loadingHtml = `
            <div id="loading-card" style="position: absolute; top: 20%; left: 50%; transform: translate(-50%, -50%); z-index: 15; background-color: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <div style="display: flex; align-items: center; justify-content: center; padding: 16px;">
                    <div style="border: 3px solid #f3f3f3; border-radius: 50%; border-top: 3px solid #3498db; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-right: 8px;"></div>
                    <span style="font-size: 14px;">กำลังค้นหาสถานีอนามัยใกล้ฉัน...</span>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHtml);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const poiResponse = await axios.get(`https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=Public%20Health%20Center&key=test2022`);
                const responseData = poiResponse.data.data;
                console.log(responseData);

                const routePromises = responseData.map(async (item) => {
                    const { lat, lon } = item;

                    try {
                        const routeResponse = await axios.get(`https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=test2022`);
                        return routeResponse.data.data.distance;
                    } catch (error) {
                        console.error('Error fetching route data:', error);
                        return null;
                    }
                });

                const distances = await Promise.all(routePromises);

                responseData.forEach((item, index) => {
                    const { lat, lon, name, address, tel } = item;
                    const distance = distances[index];

                    const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                    const whereMapUrl = `https://where.gistda.or.th/route?dir=${latitude}-${longitude},${lat}-${lon}&result=true&swipe=1`;

                    const cardHtml = renderToString(
                        <CardContent
                            spacing={1}
                            style={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                transition: 'opacity 0.3s',
                                display: 'flex',
                                whiteSpace: 'nowrap',
                                borderRadius: '5px',
                                padding: '20px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                border: '2px solid #8DBAFF',
                            }}
                        >
                            <Typography component="div">
                                <Box style={{ fontWeight: 'bold', margin: 1 }}>{name}</Box>
                                <Box style={{ fontWeight: 'light', margin: 1 }}>{address}</Box>
                                <Box
                                    sx={{
                                        fontWeight: 'light',
                                        m: 1,
                                        color: '#8DBAFF',
                                        verticalAlign: 'middle',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {tel && (
                                        <>
                                            <PhoneIcon style={{ color: '#8DBAFF', width: '20px', verticalAlign: 'middle' }} />
                                            &nbsp;{tel}
                                            <br />
                                        </>
                                    )}
                                </Box>
                                {distance !== null && (
                                    <Box style={{ fontWeight: 'light', margin: 1 }}>
                                        <StraightenIcon style={{ color: '#8DBAFF', width: '20px', verticalAlign: 'middle' }} />
                                        &nbsp;{(distance / 1000).toFixed(2)} กิโลเมตร
                                    </Box>
                                )}
                                <CardActions style={{ display: 'flex' }}>
                                    <Box style={{ display: 'flex', margin: '5px' }}>
                                        <Button
                                            href={whereMapUrl}
                                            target="_blank"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: '180px',
                                                height: '20px',
                                                padding: '0.5rem',
                                                borderRadius: '15px',
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <img
                                                src="https://where.gistda.or.th/favicon.ico"
                                                alt="Favicon"
                                                style={{
                                                    width: '1.5em',
                                                    borderRadius: '50%',
                                                    padding: '2px',
                                                    boxShadow: 'inset 4px 4px 4px rgba(255, 255, 255, 0.7)',
                                                }}
                                            />
                                            <span style={{ margin: '10px', color: '#5686E1' }}>WHERE</span>
                                        </Button>
                                    </Box>
                                    <Box style={{ display: 'flex', margin: '5px' }}>
                                        <Button
                                            href={googleMapUrl}
                                            target="_blank"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                maxWidth: '180px',
                                                height: '20px',
                                                padding: '0.5rem',
                                                borderRadius: '15px',
                                                backgroundColor: 'white',
                                                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(197, 197, 197, 0.25)',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <GoogleIcon
                                                style={{
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    padding: '2px',
                                                    backgroundColor: '#5686E1',
                                                    boxShadow: 'inset 4px 4px 4px rgba(255, 255, 255, 0.7)',
                                                }}
                                            />
                                            <span style={{ margin: '10px', color: '#5686E1' }}>Google Map</span>
                                        </Button>
                                    </Box>
                                </CardActions>
                            </Typography>
                        </CardContent>
                    );

                    const iconHtml = renderToString(
                        <MedicalInformation
                            style={{
                                color: 'white',
                                borderRadius: '50%',
                                backgroundColor: '#2196F3',
                                padding: '2px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    );

                    const markerHtml = `
                        <style>
                            .marker-container {
                                position: relative;
                                display: inline-block;
                                z-index: 20;
                            }
    
                            .card-container {
                                visibility: hidden;
                                z-index: 100;
                                top: -10em;
                                position: absolute;
                                left: 50%;
                                transform: translateX(-50%);
                                transition: 0.25s ease-in-out;
                            }
    
                            .marker-container:hover .card-container {
                                visibility: visible;
                                position: absolute;
                                z-index: 9999;
                            }
                        </style>
    
                        <div class='marker-container'>
                            <div class='marker-icon'>
                                ${iconHtml}
                            </div>
                            <div class='card-container'>
                                <div class='hover-card' style="z-index: 1000">
                                    ${cardHtml}
                                </div>
                            </div>
                        </div>
                    `;

                    const marker = new window.sphere.Marker(
                        { lat, lon },
                        {
                            icon: {
                                html: markerHtml,
                                offset: { x: 18, y: 21 },
                            },
                        }
                    );

                    map.Overlays.add(marker);
                });

                map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });

                // Remove the loading card once markers are added
                const loadingCard = document.getElementById('loading-card');
                if (loadingCard) {
                    loadingCard.remove();
                }
            } catch (error) {
                console.error('Error fetching POI data:', error);

                // Remove the loading card in case of an error
                const loadingCard = document.getElementById('loading-card');
                if (loadingCard) {
                    loadingCard.remove();
                }
            }
        });
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// Geo Tool  ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Search Bar ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////
    const searchRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Fetch suggestions based on input value
    const handleSearch = () => {
        const API = 'https://api.sphere.gistda.or.th/services/search/suggest';
        const inputValue = searchRef.current.value.trim();

        if (!inputValue) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        axios.get(API, {
            params: {
                keyword: inputValue,
                limit: 6,
                sdx: true,
                key: 'test2022'
            }
        })
            .then(response => {
                const data = response.data.data;
                setSuggestions(data);
                setShowSuggestions(true);
                setSelectedIndex(-1);
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            });
    };

    // Handle keyboard navigation and selection
    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault(); // Prevent scrolling
            setSelectedIndex(prevIndex => (prevIndex + 1) % suggestions.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault(); // Prevent scrolling
            setSelectedIndex(prevIndex => (prevIndex - 1 + suggestions.length) % suggestions.length);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                // Handle item selection
                const selectedItem = suggestions[selectedIndex];
                searchRef.current.value = selectedItem.name; // Update input value
                navigate(selectedItem.name); // Navigate or handle the selected item
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }
    };

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.addEventListener('keydown', handleKeyDown);
            return () => {
                searchRef.current.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [suggestions, selectedIndex, handleKeyDown]);

    // Handle clear button click
    const handleClearClick = () => {
        setSuggestions([]);
        setShowSuggestions(false);
        if (searchRef.current) {
            searchRef.current.value = '';
        }
    };

    const handleSuggestionClick = (itemName) => {
        searchRef.current.value = itemName; // Update the search bar's value
        navigate(itemName);
        setSuggestions([]);
        setShowSuggestions(false);
    };



    // Navigate or handle selected item
    const navigate = (itemName) => {
        const loc = `${itemName}`;
        const API = 'https://api.sphere.gistda.or.th/services/search/search?';

        axios.get(API, {
            params: {
                keyword: loc,
                limit: 6,
                showdistance: true,
                key: 'test2022'
            }
        })
            .then(response => {
                const responseData = response.data.data;
                responseData.forEach(item => {
                    const lat = item.lat;
                    const lon = item.lon;
                    const map = sphereMapRef.current;

                    var marker = new window.sphere.Marker({ lat: lat, lon: lon },
                        {
                            title: 'Custom Marker',
                            icon: {
                                html: `
                                <div style="display: flex; align-items: center;">
                                <span style="font-family: 'Prompt';">${item.name}</span>
                                <img src="src/Icon/Marker_Animation.gif" alt="Computer man" style="width:48px;height:48px;">
                                </div>`,
                                offset: { x: 18, y: 21 }
                            }
                        }
                    );
                    map.Overlays.add(marker);
                    map.goTo({ center: { lat: lat, lon: lon }, zoom: 13 });
                });
            })
            .catch(error => console.error('Error navigating:', error));
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Search Bar ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////


    const remove = () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();
    };

    const location = () => {
        const map = sphereMapRef.current;
        map.Ui.Geolocation.trigger();
        if (map && map.Ui && map.Ui.Geolocation) {
            try {
                map.Ui.Geolocation.trigger();
            } catch (error) {
                console.error('Geolocation trigger error:', error);
            }
        } else {
            console.error('Geolocation functionality is not available.');
        }
    };

    const thZoom = () => {
        const map = sphereMapRef.current;
        map.goTo({ center: { lon: 100.590204861417, lat: 13.861545245028843 }, zoom: 4.8 });
    };

    const zoomin = () => {
        const map = sphereMapRef.current;
        const currentZoom = map.zoom();
        map.zoom(currentZoom + 1)
    };

    const zoomout = () => {
        const map = sphereMapRef.current;
        const currentZoom = map.zoom();
        map.zoom(currentZoom - 1)
    };

    const StreetBase = () => {
        const map = sphereMapRef.current;
        map.Layers.setBase(window.sphere.Layers.STREETS);
    };

    const HybridBase = () => {
        const map = sphereMapRef.current;
        map.Layers.setBase(window.sphere.Layers.HYBRID);
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const popperRef = useRef(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    // Handle click outside to close the popper
    const handleClickOutside = (event) => {
        if (popperRef.current && !popperRef.current.contains(event.target) && !event.currentTarget.contains(event.target)) {
            setAnchorEl(null);
        }
    };

    useEffect(() => {
        if (anchorEl) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [anchorEl]);

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    ///////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////// Geo Tool  ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return <div id="map" ref={mapRef}
        style={{
            width: "100%",
        }}>
        <>

            <div style={{
                position: 'absolute',
                right: '1em',
                top: '1em',
                zIndex: '10'
            }}>
                <div className="healthStack">
                    <Stack className='Stack' sx={{ position: 'absolute', zIndex: 10, top: '0.5rem', right: 420 }}
                        direction="row" spacing={1}>

                        <Chip
                            onClick={insertAllhospital}
                            size="medium"
                            sx={{
                                bgcolor: 'white',
                                color: 'black',
                                boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                            }}
                            label="สถานพยาบาลทั้งหมด"
                        />
                        <Chip size="medium"
                            onClick={insertHospital}
                            sx={{
                                bgcolor: 'white',
                                boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)'
                            }}
                            label="โรงพยาบาล"
                            icon={
                                <LocalHospitalIcon
                                    style={{
                                        color: 'white',
                                        borderRadius: '50%',
                                        padding: '2px',
                                        backgroundColor: '#FF6968',
                                    }}
                                />
                            }
                        />
                        <Chip
                            onClick={insertClinic}
                            size="medium"
                            sx={{
                                bgcolor: 'white',
                                boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)'
                            }}
                            icon={<Vaccines
                                style={{
                                    color: 'white',
                                    borderRadius: '50%',
                                    backgroundColor: '#1DBEB8',
                                    padding: '2px',
                                }} />}
                            label="คลินิก" />

                        <Chip
                            onClick={insertHealthSt}
                            size="medium"
                            sx={{
                                bgcolor: 'white',
                                boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)'
                            }}
                            icon={<MedicalInformation
                                style={{
                                    color: 'white',
                                    borderRadius: '50%',
                                    backgroundColor: '#2196F3',
                                    padding: '2px',
                                }} />}
                            label="สถานีอนามัย" />
                    </Stack>
                </div>
                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: 400,
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
                        borderRadius: '20px'
                    }}
                >
                    <InputBase
                        id='result'
                        type="text"
                        inputRef={searchRef}
                        sx={{ ml: 1, flex: 1, fontFamily: 'Prompt' }}
                        placeholder="ระบุคำค้นหา เช่น ชื่อสถานที่"
                        inputProps={{ 'aria-label': 'ระบุคำค้นหา เช่น ชื่อสถานที่' }}
                        onChange={handleSearch}
                    />
                    <Tooltip
                        title="ล้าง"
                        arrow
                        placement="bottom"
                        TransitionComponent={Zoom}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    color: 'black',
                                    bgcolor: 'white',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: 'white',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            onClick={handleClearClick}
                        >
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip
                        title="ค้นหา"
                        arrow
                        placement="bottom"
                        TransitionComponent={Zoom}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    color: 'black',
                                    bgcolor: 'white',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: 'white',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            onClick={handleSearch}
                            id='myBtn'
                            type="button"
                            sx={{ p: '10px' }}
                            aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                </Paper>
                {showSuggestions && (
                    <Paper sx={{ width: 408, marginTop: '0.5rem', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                        <Box
                            sx={{
                                // overflowY: 'auto',
                                maxHeight: '30vh'
                            }}
                        >
                            {suggestions.length > 0 ? (
                                <List id='place' sx={{ padding: '0.5rem' }}>
                                    {suggestions.map((item, index) => (
                                        <ListItemButton
                                            onClick={() => handleSuggestionClick(item.name)}
                                            key={index}
                                            selected={index === selectedIndex}
                                        >
                                            {item.name}
                                        </ListItemButton>
                                    ))}
                                </List>
                            ) : (
                                <p style={{
                                    marginTop: '0.5rem',
                                    height: '1.5rem',
                                    padding: '0.5rem',
                                    textAlign: 'center',
                                    fontSize: '16px'
                                }}>ไม่พบข้อมูล</p>
                            )}
                        </Box>
                    </Paper>
                )}
            </div>
            <Box className='Box' sx={{ zIndex: '10', marginTop: '-1.5%', justifyContent: 'space-between' }}>
                <SpeedDial
                    className="heatModel"
                    ariaLabel="SpeedDial basic example"
                    icon={<LocalFireDepartmentIcon />}
                    direction="left"
                    sx={{
                        marginRight: '0.25rem',
                        '& .MuiFab-primary': {
                            borderRadius: '50%',
                            width: 50,
                            height: 50,
                            background: 'linear-gradient(145deg, #FF4500 3.3%, #FF6F00 45.86%, #DDA0DD 90%)',
                            color: '#FFFFFF'

                        },
                        '&:hover .MuiFab-primary': {
                            boxShadow: '0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.6)',
                            transition: 'box-shadow 0.5s ease-in-out',
                            animation: 'blinkShadow 2.5s infinite'
                        },
                    }}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                color: '#FF9900',
                                bgcolor: 'white',
                                fontFamily: 'Prompt',
                                '& .MuiTooltip-arrow': {
                                    color: 'white',
                                },
                            },
                        },
                    }}
                >
                    <SpeedDialAction
                        className="HIDsat"
                        key="satellite"
                        icon={<SatelliteAltIcon />}
                        tooltipTitle="ดาวเทียม"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    color: '#FF9900',
                                    bgcolor: '#fff',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: '#FF9900',
                                    },
                                },
                            },
                        }}
                    />

                    <SpeedDialAction
                        className="HIDmodel"
                        key="HIDmodel"
                        icon={<ModelTrainingIcon />}
                        tooltipTitle="แบบจำลอง: พื้นที่ศึกษาจังหวัดนครราชสีมา"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    color: '#FF9900',
                                    bgcolor: '#fff',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: '#FF9900',
                                    },
                                },
                            },
                        }}
                    />

                    <SpeedDialAction
                        className="HIDtmd"
                        key="tmd"
                        icon={
                            <img style={{ width: '25px' }} src={Tmd} />
                        }
                        tooltipTitle="กรมอุตุนิยมวิทยา"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    color: '#FF9900',
                                    bgcolor: '#fff',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: '#FF9900',
                                    },
                                },
                            },
                        }}
                    />
                </SpeedDial>

                <FormGroup
                    className='Zoom'
                    sx={{
                        margin: '0.5rem',
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        borderRadius: '15px',
                        backgroundColor: '#ff9900',
                        boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                        color: 'white',
                        width: '40px',
                        '&:hover': {
                            color: '#ff9900',
                        },
                    }}
                >
                    <Tooltip
                        title="ซูมเข้า"
                        arrow
                        placement="left"
                        TransitionComponent={Zoom}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: '#ff9900',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: '#ff9900',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            className="zoomin"
                            onClick={zoomin}
                            sx={{
                                width: '35px',
                                color: 'white',
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                        <hr style={{ width: '80%', opacity: '50%' }} />
                    </Tooltip>
                    <Tooltip
                        title="ซูมออก"
                        arrow
                        placement="left"
                        TransitionComponent={Zoom}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: '#ff9900',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: '#ff9900',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            className="zoomout"
                            onClick={zoomout}
                            sx={{
                                borderRadius: '0',
                                width: '35px',
                                color: 'white',
                            }}
                        >
                            <RemoveIcon />
                        </IconButton>
                    </Tooltip>
                </FormGroup>

                <Tooltip
                    title="ขยายทั้งประเทศ" arrow placement="left"
                    TransitionComponent={Zoom}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#ff9900',
                                fontFamily: 'Prompt',
                                '& .MuiTooltip-arrow': {
                                    color: '#ff9900',
                                },
                            },
                        },
                    }}
                >
                    <IconButton
                        className="thZoom"
                        onClick={thZoom}
                        sx={{
                            margin: '0.5rem',
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                            '&:hover': {
                                fill: "#ff9900",
                            },
                            img: {
                                width: '25px',
                            },
                        }}
                    >
                        <svg
                            className="thSvg"
                            width="800px"
                            height="800px"
                            viewBox="0 0 141 260"
                            xmlns="http://www.w3.org/2000/svg"
                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                            version="1.1"
                        >
                            <polygon points="129.539,74.861 123.279,62.39 123.967,52.692 107.962,37.209 98.146,37.304 87.832,45.295 78.396,39.154 66.777,47.642 59.072,50.843 61.182,36.617 63.885,31.329 62.913,17.791 52.717,16.937 49.635,13.215 49.113,2 35.101,5.841 25.5,13.618 6.411,18.905 2.025,34.625 8.545,50.961 17.318,60.446 20.566,69.977 19.333,89.23 12.647,93.213 13.951,98.785 29.244,117.587 29.932,126.502 37.543,150.734 24.668,168.588 12.908,207.734 20.685,210.626 39.677,232.132 40.601,237.49 47.572,239.6 58.455,246.524 62.936,247.425 63.387,258 70.239,253.542 75.479,256.174 80.198,247.14 74.08,241.663 71.306,237.206 62.652,236.803 50.654,228.978 47.548,220.964 49.991,218.072 47.857,209.204 43.328,205.932 40.08,194.219 31.757,192.891 29.363,176.081 35.385,164.96 36.523,159.104 44.182,144.167 43.115,125.08 45.272,122.733 50.56,121.571 60.447,121.997 60.518,136.318 74.341,135.157 84.086,140.966 86.386,134.185 83.446,125.056 93.167,109.384 98.692,106.183 127.096,104.665 136.913,101.891 138.975,82.638" />
                        </svg>

                    </IconButton>
                </Tooltip>

                <Tooltip
                    title="แผนที่ฐาน" arrow placement="left"
                    TransitionComponent={Zoom}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#ff9900',
                                fontFamily: 'Prompt',
                                '& .MuiTooltip-arrow': {
                                    color: '#ff9900',
                                },
                            },
                        },
                    }}
                >
                    <IconButton
                        aria-describedby={id} type="button" onClick={handleClick}
                        className="basemap"
                        sx={{
                            margin: '0.5rem',
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                            color: 'white',
                            '&:hover': {
                                color: "#ff9900"
                            },
                        }}
                    >
                        <LayersIcon />
                    </IconButton>
                </Tooltip>

                <Popper className='Basemap'
                    TransitionComponent={Zoom}
                    placement="left"
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    ref={popperRef}>
                    <Card sx={{ marginRight: '1.5rem' }}>
                        <Box className='imgMap'
                            style={{
                                zIndex: '20',
                                textAlign: 'center',
                                display: 'flex'
                            }}>
                            <CardActionArea
                                onClick={StreetBase}
                                className='Street'
                                style={{ padding: '0.25rem' }}
                            >
                                <img src={Street} alt="Street" />
                                <br />
                                <span>เส้นถนน</span>
                            </CardActionArea>

                            <CardActionArea
                                onClick={HybridBase}
                                className='Sat'
                                style={{
                                    padding: '0.25rem',
                                    zIndex: '999'
                                }}
                            >
                                <img src={Satt} />
                                <br />
                                <span>ดาวเทียม</span>
                            </CardActionArea>
                        </Box>
                    </Card>
                </Popper>

                <Tooltip
                    title="ตำแหน่งของฉัน" arrow placement="left"
                    TransitionComponent={Zoom}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#ff9900',
                                fontFamily: 'Prompt',
                                '& .MuiTooltip-arrow': {
                                    color: '#ff9900',
                                },
                            },
                        },
                    }}
                >
                    <IconButton
                        className="location"
                        onClick={location}
                        sx={{
                            margin: '0.5rem',
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                            color: 'white',
                            bgcolor: '#fff',
                            '&:hover': {
                                color: "#ff9900",
                            },
                        }}
                    >
                        <MyLocationIcon />
                    </IconButton>
                </Tooltip>

                <Tooltip
                    title="ล้างการทำงาน" arrow placement="left"
                    TransitionComponent={Zoom}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                color: '#d52d2d',
                                bgcolor: 'white',
                                fontFamily: 'Prompt',
                                '& .MuiTooltip-arrow': {
                                    color: 'white',
                                },
                            },
                        },
                    }}
                >
                    <IconButton
                        className="remove"
                        onClick={remove}
                        sx={{
                            margin: '0.5rem',
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                            color: 'white',
                            '&:hover': {
                                color: "white",
                                '.MuiSvgIcon-root': {
                                    color: '#d52d2d',
                                },
                            },
                        }}
                    >
                        <WrongLocationIcon
                            sx={{
                                color: '#ff9900'
                            }} />
                    </IconButton>
                </Tooltip>
                <FormGroup style={{ position: 'fixed', bottom: '2rem' }}>

                    <Tooltip
                        title="การใช้งาน" arrow placement="left"
                        TransitionComponent={Zoom}
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    color: '#707070',
                                    bgcolor: 'white',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: 'white',
                                    },
                                },
                            },
                        }}
                    >
                        <IconButton
                            className="infoIcon"
                            // onClick={remove}
                            sx={{
                                margin: '0.5rem',
                                boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                                color: 'white'
                            }}
                        >
                            <InfoIcon
                                sx={{
                                    color: '#707070'
                                }} />
                        </IconButton>
                    </Tooltip>
                </FormGroup>
            </Box>
        </>
    </div >;
};

export default Map;