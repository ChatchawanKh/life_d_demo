import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import "./Map.css"
// import addWMS from "./addWMS";

import IconButton from '@mui/material/IconButton';
import { Box } from "@mui/material";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';

//Icon
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LayersIcon from '@mui/icons-material/Layers';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const Map = () => {
    const mapRef = useRef(null);
    const sphereMapRef = useRef(null);
    const [isPM25Checked, setIsPM25Checked] = useState(true);
    const [pm25wmsLayer, setPm25wmsLayer] = useState(null);


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
                map.Ui.LayerSelector.visible(true);
                console.log(map);

                let pm25wms = new sphere.Layer('0', {
                    type: sphere.LayerType.WMS,
                    url: "https://service-proxy-765rkyfg3q-as.a.run.app/api_geoserver/geoserver/pm25_hourly_raster_24hr/wms",
                    zoomRange: { min: 1, max: 15 },
                    zIndex: 5,
                    opacity: 0.8,
                    id: 'layer_24pm25'
                });
                map.Layers.add(pm25wms);
                setPm25wmsLayer(pm25wms);
                setIsPM25Checked(true);


                const getLoc = () => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            console.log(`UserLocation Lat ${latitude}, lon ${longitude}`);
                            map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 15 });

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

                                    //Color Text
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
                                    //Color Text

                                    const pm25Formatted = pm25.toFixed(2);
                                    const valueElement = document.getElementById('value');
                                    valueElement.innerHTML = `<span style="color: ${color};">${pm25Formatted} </span>`;
                                    document.getElementById('level').innerHTML = `<span style="color: ${color}; font-weight: bold; font-size: 30px;"> ${level}</span>`


                                    // const encodedPv = encodeURIComponent(pv);
                                    // console.log(encodedPv);
                                    // axios.get(`https://tmd.go.th/api/WeatherForecast7Day/weather-forecast-7day-by-province?
                                    //     %20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20
                                    //     Sorting=weatherForecast7Day.recordTime%20asc&FilterText=${encodedPv}&MaxResultCount=7&culture=th-TH`)
                                    //     .then(response => {
                                    //         const temp_rain = response.data
                                    //         console.log(temp_rain);
                                    //     })
                                })
                        }
                    );
                    // map.Event.bind(window.sphere.EventName.Ready, () => {
                    //     map.Ui.Toolbar.visible(false);

                    //     window.sphere.Util.loadStyle(sphere.Server.map + "/js/mapbox-gl-draw.css"),
                    //         window.sphere.Util.loadScript(sphere.Server.map + "/js/mapbox-gl-draw.js", () => {

                    //             // see more options https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#options
                    //             const drawOptions = {
                    //                 controls: {
                    //                     Geolocation: true,
                    //                     point: true,
                    //                     line_string: true,
                    //                     polygon: true,
                    //                     trash: true,
                    //                     combine_features: false,
                    //                     uncombine_features: false
                    //                 }
                    //             };

                    //             var drawPanel = new window.MapboxDraw(drawOptions);
                    //             map.Renderer.addControl(drawPanel, 'top-right'); // see details https://docs.mapbox.com/mapbox-gl-js/api/#map#addcontrol
                    //         });
                    // });

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

    const handlePM25Toggle = (event) => {
        setIsPM25Checked(event.target.checked);
        // var sphere = window.sphere

        if (event.target.checked) {
            // eslint-disable-next-line no-undef
            let pm25wms = new sphere.Layer('0', {
                // eslint-disable-next-line no-undef
                type: sphere.LayerType.WMS,
                url: "https://service-proxy-765rkyfg3q-as.a.run.app/api_geoserver/geoserver/pm25_hourly_raster_24hr/wms",
                zoomRange: { min: 1, max: 15 },
                zIndex: 5,
                opacity: 1,
                id: 'layer_24pm25'
            });
            sphereMapRef.current.Layers.add(pm25wms);
            setPm25wmsLayer(pm25wms);
        } else {
            if (pm25wmsLayer) {
                sphereMapRef.current.Layers.remove(pm25wmsLayer);
                setPm25wmsLayer(null);
            }
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////

    // Event handler for geolocation button
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
                map.zoom(currentZoom + 1); // Zoom in by increasing the zoom level
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
                map.zoom(currentZoom - 1); // Zoom out by decreasing the zoom level
            } catch (error) {
                console.error('Zoom out error:', error);
            }
        } else {
            console.error('Zoom out functionality is not available.');
        }
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////

    const [anchor, setAnchor] = React.useState(null);
    const handleClick = (event) => {
        setAnchor(anchor ? null : event.currentTarget);
    };

    const open = Boolean(anchor);
    const id = open ? 'simple-popper' : undefined;

    return <div id="map" ref={mapRef} style={{
        width: "100%",
    }}>
        <>
            <Box className='Box'>
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
                        control={<Switch checked={isPM25Checked}
                            onChange={handlePM25Toggle} color="primary" />}
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
                            color: "#00B2FF",

                        },
                    }}>
                    <IconButton className="zoomin"
                        onClick={zoomin}
                        sx={{
                            width: '35px',
                            color: 'white'
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                    <hr style={{ width: '80%', opacity: '50%' }} />
                    <IconButton className="Zoomout"
                        onClick={zoomout}
                        sx={{
                            borderRadius: '0',
                            width: '35px',
                            color: 'white'
                        }}
                    >
                        <RemoveIcon />
                    </IconButton>
                </FormGroup>

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

                <IconButton
                    className="basemap"
                    onClick={handleClick}
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
                <BasePopup
                    sx={{ left: 'rem' }}
                    id={id}
                    open={open}
                    anchor={anchor}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}>
                    <span>The content of the Popup.</span>
                </BasePopup>

                <IconButton
                    className="location"
                    onClick={location}
                    sx={{
                        margin: '0.5rem',
                        boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                        color: 'white',
                        '&:hover': {
                            color: "#00B2FF",
                        },
                    }}
                >
                    <MyLocationIcon />

                </IconButton>
            </Box>
        </>
    </div >;

};

export default Map;
