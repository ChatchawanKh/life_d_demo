import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import "./Map.css"
import { renderToString } from 'react-dom/server';
// import { styled, css } from '@mui/system';

//Mui infra
import { List, ListItemButton, Box, Chip, Stack, Typography, CardContent, CardActions, Button } from "@mui/material";
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

//Icon
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
                                    valueElement.innerHTML = `<span style="color: ${color};">${pm25Formatted} </span>`;
                                    document.getElementById('level').innerHTML = `<span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span>`


                                    // const encodedPv = encodeURIComponent(pv);
                                    // console.log(encodedPv);
                                    // axios.get(`https://tmd.go.th/api/WeatherForecast7Day/weather-forecast-7day-by-province?
                                    //     %20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20
                                    //     Sorting=weatherForecast7Day.recordTime%20asc&FilterText=กรุงเทพมหานคร&MaxResultCount=7&culture=th-TH`)
                                    //     .then(response => {
                                    //         const temp_rain = response.data
                                    //         console.log(temp_rain);
                                    //     })
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
    }, []);

    const handlePM25Toggle = (e) => {
        const sphere = window.sphere;
        const map = sphereMapRef.current;

        const isChecked = e.target.checked;
        setIsPM25Checked(isChecked);

        if (isChecked) {
            console.log('Adding PM2.5 WMS layer');
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
    };

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

    const insertAllhospital = () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();
        insertHospital();
        insertClinic();
        insertHealthSt();
    };

    // const insertHospital = () => {
    //     const map = sphereMapRef.current;
    //     map.Overlays.clear();

    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;

    //             axios.get(`https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=โรงพยาบาล&key=test2022`)
    //                 .then(response => {
    //                     const responseData = response.data.data;
    //                     responseData.forEach(item => {
    //                         const lat = item.lat
    //                         const lon = item.lon
    //                         const map = sphereMapRef.current;

    //                         const iconHtml = renderToString(<LocalHospitalIcon
    //                             style={{
    //                                 color: 'white',
    //                                 borderRadius: '50%',
    //                                 padding: '2px',
    //                                 backgroundColor: '#FF6968',
    //                             }}
    //                         />);

    //                         var marker = new window.sphere.Marker({ lat: lat, lon: lon },
    //                             {
    //                                 title: 'Custom Marker',
    //                                 icon: {
    //                                     html: `
    //                                 <div>
    //                                 ${iconHtml}
    //                                 </div>`,
    //                                     offset: { x: 18, y: 21 }
    //                                 }
    //                             }
    //                         );
    //                         map.Overlays.add(marker);
    //                         map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });
    //                     });
    //                 })
    //         }
    //     );
    // };

    // const insertClinic = () => {
    //     const map = sphereMapRef.current;
    //     map.Overlays.clear();
    //     navigator.geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;

    //             axios.get(`https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=Poly%20Clinic&key=test2022`)
    //                 .then(response => {
    //                     const responseData = response.data.data;
    //                     responseData.forEach(item => {
    //                         const lat = item.lat
    //                         const lon = item.lon
    //                         const map = sphereMapRef.current;

    //                         const iconHtml = renderToString(<Vaccines
    //                             style={{
    //                                 color: 'white',
    //                                 borderRadius: '50%',
    //                                 backgroundColor: '#1DBEB8',
    //                                 padding: '2px',
    //                             }} />

    //                         );

    //                         var marker = new window.sphere.Marker({ lat: lat, lon: lon },
    //                             {
    //                                 title: 'Custom Marker',
    //                                 icon: {
    //                                     html: `
    //                                 <div>
    //                                 ${iconHtml}
    //                                 </div>`,
    //                                     offset: { x: 18, y: 21 }
    //                                 }
    //                             }
    //                         );
    //                         map.Overlays.add(marker);
    //                         map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });
    //                     });
    //                 })
    //         }
    //     );
    // };

    const insertHospital = async () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const poiResponse = await axios.get(`https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=โรงพยาบาล&key=test2022`);
                const responseData = poiResponse.data.data;
                console.log(responseData);

                for (const item of responseData) {
                    const { lat, lon, name, address, tel } = item;
                    console.log(name);

                    let distance = null;
                    try {
                        const routeResponse = await axios.get(`https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=test2022`);
                        distance = routeResponse.data.data.distance;
                    } catch (error) {
                        console.error('Error fetching route data:', error);
                    }

                    const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                    console.log(googleMapUrl);

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

                    const markerHtml =
                        `
                            <style>
                                .marker-container {
                                    position: absolute;
                                    display: inline-block;
                                }

                                .hover-card {
                                    visibility: hidden;
                                    z-index: 0;
                                    top: 0.5em;
                                    position: absolute;
                                    left: 50%;
                                    transform: translateX(-50%);
                                    transition: 0.25s ease-in-out;
                                }

                                .marker-icon:hover{
                                    position: absolute;
                                    z-index: 100;
                                }

                                .marker-container:hover .hover-card {
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
                                    <div class='hover-card'>
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
                }

                map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });
            } catch (error) {
                console.error('Error fetching POI data:', error);
            }
        });
    };

    const insertClinic = async () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const poiResponse = await axios.get(`https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=Poly%20Clinic&key=test2022`);
                const responseData = poiResponse.data.data;
                console.log(responseData);

                for (const item of responseData) {
                    const { lat, lon, name, address, tel } = item;
                    console.log(name);

                    let distance = null;
                    try {
                        const routeResponse = await axios.get(`https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=test2022`);
                        distance = routeResponse.data.data.distance;
                    } catch (error) {
                        console.error('Error fetching route data:', error);
                    }

                    const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                    console.log(googleMapUrl);

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

                    const markerHtml =
                        `
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
                }

                map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });
            } catch (error) {
                console.error('Error fetching POI data:', error);
            }
        });
    };

    const insertHealthSt = async () => {
        const map = sphereMapRef.current;
        map.Overlays.clear();

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const poiResponse = await axios.get(`https://api.sphere.gistda.or.th/services/poi/search?lon=${longitude}&lat=${latitude}&limit=20&tag=Public%20Health%20Center&key=test2022`);
                const responseData = poiResponse.data.data;
                console.log(responseData);

                for (const item of responseData) {
                    const { lat, lon, name, address, tel } = item;
                    console.log(name);

                    let distance = null;
                    try {
                        const routeResponse = await axios.get(`https://api.sphere.gistda.or.th/services/route/route?flon=${longitude}&flat=${latitude}&tlon=${lon}&tlat=${lat}&mode=d&key=test2022`);
                        distance = routeResponse.data.data.distance;
                    } catch (error) {
                        console.error('Error fetching route data:', error);
                    }

                    const googleMapUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${lat},${lon}/@${lat},${lon},8z/data=!3m2!1e3!4b1!4m2!4m1!3e0`;
                    console.log(googleMapUrl);

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

                    const markerHtml =
                        `
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
                }

                map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 13 });
            } catch (error) {
                console.error('Error fetching POI data:', error);
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

    const handleSearchClick = () => {
        const API = 'https://api.sphere.gistda.or.th/services/search/suggest';
        const inputValue = searchRef.current.value.trim();
        console.log(inputValue);

        axios.get(API, {
            params: {
                keyword: inputValue,
                limit: 10,
                sdx: true,
                key: 'test2022'
            }
        })
            .then(response => {
                const name = response.data.data;
                setSuggestions(name);
                setShowSuggestions(true);
            })
    }


    const handleClearClick = () => {
        setSuggestions([]);
        setShowSuggestions(false);
        searchRef.current.value = '';
    };

    const navigate = (itemName) => {
        const loc = `${itemName}`
        const API = 'https://api.sphere.gistda.or.th/services/search/search?';

        axios.get(API, {
            params: {
                keyword: loc,
                limit: 10,
                showdistance: true,
                key: 'test2022'
            }
        })
            .then(response => {
                const responseData = response.data.data;
                responseData.forEach(item => {
                    const lat = item.lat
                    const lon = item.lon
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

    const zoomin = () => {
        const map = sphereMapRef.current;
        if (map && typeof map.zoom === 'function') {
            try {
                const currentZoom = map.zoom();
                map.zoom(currentZoom + 1);
            } catch (error) {
                console.error('Zoom in error:', error);
            }
        } else {
            console.error('Zoom in functionality is not available.');
        }
    };

    const zoomout = () => {
        const map = sphereMapRef.current;
        if (map && typeof map.zoom === 'function') {
            try {
                const currentZoom = map.zoom();
                map.zoom(currentZoom - 1);
            } catch (error) {
                console.error('Zoom out error:', error);
            }
        } else {
            console.error('Zoom out functionality is not available.');
        }
    };

    const StreetBase = () => {
        const map = sphereMapRef.current;
        map.Layers.setBase(window.sphere.Layers.STREETS);
    };

    const HybridBase = () => {
        const map = sphereMapRef.current;
        map.Layers.setBase(window.sphere.Layers.HYBRID);
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const popperRef = useRef(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClickOutside = (event) => {
        if (popperRef.current && !popperRef.current.contains(event.target)) {
            setAnchorEl(null);
        }
    };

    useEffect(() => {
        if (anchorEl) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
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
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25), inset 0px 4px 4px rgba(0, 0, 0, 0.25)'
                    }}
                >
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
                    ><IconButton
                        onClick={handleSearchClick}
                        id='myBtn'
                        type="button"
                        sx={{ p: '10px' }}
                        aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Tooltip>
                    <InputBase
                        id='result'
                        type="text"
                        inputRef={searchRef}
                        sx={{ ml: 1, flex: 1, fontFamily: 'Prompt' }}
                        placeholder="ระบุคำค้นหา เช่น ชื่อสถานที่"
                        inputProps={{ 'aria-label': 'ระบุคำค้นหา เช่น ชื่อสถานที่' }}
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
                </Paper>
                {showSuggestions && (
                    <Paper sx={{ width: 408, }}>
                        <Box
                            sx={{
                                marginTop: '0.5rem',
                                overflowY: 'auto',
                                maxHeight: '20vh'
                            }}
                        >
                            {suggestions.length > 0 ? (
                                <List id='place' sx={{ padding: '0.5rem' }}>
                                    {suggestions.map((item, index) => (
                                        <ListItemButton onClick={() => navigate(item.name)} key={index}>
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
            <Box className='Box' sx={{ zIndex: '10', marginTop: '0', justifyContent: 'space-between' }}>
                <FormGroup
                    sx={{
                        backgroundColor: '#00B2FF',
                        boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                        borderRadius: '15px',
                        width: '130px',
                        alignItems: 'center'
                    }}>
                    <FormControlLabel
                        className="check"
                        sx={{
                            margin: '0.5rem',
                            height: '18px'
                        }}
                        value="PM2.5"
                        control={<Switch checked={isPM25Checked} onChange={handlePM25Toggle} color="primary" />}
                        label={<span style={{ fontSize: '14px', color: 'white' }}>PM2.5</span>}
                        labelPlacement="start"
                    />
                </FormGroup>

                <FormGroup
                    className='Zoom'
                    sx={{
                        margin: '0.5rem',
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        borderRadius: '15px',
                        backgroundColor: '#00B2FF',
                        boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                        color: 'white',
                        width: '40px',
                        '&:hover': {
                            color: '#00B2FF',
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
                                    bgcolor: '#00B2FF',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: '#00B2FF',
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
                                    bgcolor: '#00B2FF',
                                    fontFamily: 'Prompt',
                                    '& .MuiTooltip-arrow': {
                                        color: '#00B2FF',
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

                {/* <Tooltip
                    title="ระบุตำแหน่งที่สนใจ" arrow placement="left"
                    TransitionComponent={Zoom}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#00B2FF',
                                fontFamily: 'Prompt',
                                '& .MuiTooltip-arrow': {
                                    color: '#00B2FF',
                                },
                            },
                        },
                    }}
                >
                    <IconButton
                        className="hosnear"
                        sx={{
                            margin: '0.5rem',
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                            color: 'white',
                            '&:hover': {
                                color: "#00B2FF",
                            },
                        }}
                    >
                        <WhereToVoteIcon />
                    </IconButton>
                </Tooltip> */}


                <Tooltip
                    title="แผนที่ฐาน" arrow placement="left"
                    TransitionComponent={Zoom}
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: '#00B2FF',
                                fontFamily: 'Prompt',
                                '& .MuiTooltip-arrow': {
                                    color: '#00B2FF',
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
                                color: "#00B2FF",
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
                    <Card
                        sx={{
                            zIndex: '50',
                            marginRight: '1.5rem',
                            padding: '0.25rem'
                        }}>


                        <Box
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
                                bgcolor: '#00B2FF',
                                fontFamily: 'Prompt',
                                '& .MuiTooltip-arrow': {
                                    color: '#00B2FF',
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
                            color: 'white',
                            '&:hover': {
                                color: "#00B2FF",
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
                                color: '#00B2FF'
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
