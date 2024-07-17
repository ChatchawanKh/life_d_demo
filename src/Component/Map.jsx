import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import "./Map.css"
// import { styled, css } from '@mui/system';

//Mui infra
import { List, ListItemButton, Box } from "@mui/material";
import Zoom from '@mui/material/Zoom';
import Tooltip from '@mui/material/Tooltip';
import { Popper } from '@mui/base/Popper';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
// import { TextField, Autocomplete } from '@mui/material';

//Icon
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LayersIcon from '@mui/icons-material/Layers';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Street from '/src/Icon/street.svg'
import Satt from '/src/Icon/satt.svg'
import ClearIcon from '@mui/icons-material/Clear';
// import { response } from "express";


const Map = () => {
    const mapRef = useRef(null);
    const sphereMapRef = useRef(null);
    const [isPM25Checked, setIsPM25Checked] = useState(true);
    const [pm25wmsLayer, setPm25wmsLayer] = useState(null);

    // const [options, setOptions] = useState([]);
    // const [inputValue, setInputValue] = useState('');

    // useEffect(() => {
    //     if (inputValue !== '') {
    //         const fetchData = async () => {
    //             try {
    //                 const response = await axios.get(`https://api.sphere.gistda.or.th/services/search/suggest`, {
    //                     params: {
    //                         keyword: inputValue,
    //                         limit: 5,
    //                         sdx: true,
    //                         key: 'test2022'
    //                     }
    //                 });
    //                 setOptions(response.data.suggestions || []);
    //             } catch (error) {
    //                 console.error('Error fetching suggestions:', error);
    //             }
    //         };

    //         fetchData();
    //     }
    // }, [inputValue]);


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

                var pm25wms = new sphere.Layer('0', {
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
                            // console.log(`UserLocation Lat ${latitude}, lon ${longitude}`);
                            // map.goTo({ center: { lat: latitude, lon: longitude }, zoom: 15 });

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
    ///////////////////////////////////////// Geo Tool  ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Search Bar ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////
    const searchRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // const [clickedNavigation, setClickedNavigation] = useState(null);

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
                const data = response.data.data;
                setSuggestions(data);
                setShowSuggestions(true);
            })
    }

    const handleClearClick = () => {
        setSuggestions([]);
        setShowSuggestions(false);
        searchRef.current.value = '';
    };

    const navigate = (itemName) => {
        console.log(`${itemName}`);
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

                    var marker = new window.sphere.Marker({ lat: lat, lon: lon });
                    map.Overlays.add(marker);
                    // map.Overlays.clear();
                    map.goTo({ center: { lat: lat, lon: lon }, zoom: 13 });


                    console.log(lat);
                    console.log(lon);
                });
            })


    };


    // const navigate = (event) => {
    //     const innerHTML = event.currentTarget.innerHTML;
    //     console.log(`Clicked inner HTML: ${innerHTML}`);
    //     // Add any additional logic you need here
    // };


    // const naviGation = () => {
    //     document.getElementById('clear').inner

    //     const API = `ttps://api.sphere.gistda.or.th/services/search/suggest?keyword=${encodedData}&limit=10&sdx=true&key=test2022`;
    //     const inputValue = searchRef.current.value.trim();
    //     console.log(inputValue);

    //     axios.get(API, {
    //         params: {
    //             keyword: inputValue,
    //             limit: 10,
    //             sdx: true,
    //             key: 'test2022'
    //         }
    //     })
    //         .then(response => {
    //             const data = response.data.data;
    //             setSuggestions(data);
    //             setShowSuggestions(true);
    //         })
    // }




    ///////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// Search Bar ///////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

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
                right: '1rem',
                top: '1em',
                zIndex: '10'
            }}>
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


                <Tooltip
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
                </Tooltip>
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
                <Popper
                    TransitionComponent={Zoom}
                    placement="left"
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    ref={popperRef}>
                    <Card
                        sx={{
                            marginRight: '0.5rem',
                            padding: '0.25rem'
                        }}>


                        <div className='Basemap'
                            style={{
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
                                className='Sat' style={{ padding: '0.25rem' }}>
                                <img src={Satt} />
                                <br />
                                <span>ดาวเทียม</span>
                            </CardActionArea>
                        </div>
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
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)',
                            color: 'white',
                            '&:hover': {
                                color: "#00B2FF",
                            },
                        }}
                    >
                        <MyLocationIcon />

                    </IconButton>
                </Tooltip>
            </Box>
        </>
    </div >;
};

// const grey = {
//     50: '#F3F6F9',
//     100: '#E5EAF2',
//     200: '#DAE2ED',
//     300: '#C7D0DD',
//     400: '#B0B8C4',
//     500: '#9DA8B7',
//     600: '#6B7A90',
//     700: '#434D5B',
//     800: '#303740',
//     900: '#1C2025',
// };

// const StyledPopperDiv = styled('div')(
//     ({ theme }) => css`
//       background-color: rgba(255, 255, 255, 0.7);
//       border-radius: 8px;
//       border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
//       box-shadow: ${theme.palette.mode === 'dark'
//             ? `0px 4px 8px rgb(0 0 0 / 0.7)`
//             : `0px 4px 8px rgb(0 0 0 / 0.1)`};
//       padding: 0.75rem;
//       color: ${theme.palette.mode === 'dark' ? grey[100] : grey[700]};
//       font-size: 0.875rem;
//       font-family: 'IBM Plex Sans', sans-serif;
//       font-weight: 500;
//       opacity: 1;
//       margin: 0.25rem 0;
//     `,
// );

export default Map;
