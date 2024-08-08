import * as React from 'react';
import './MapHeat.jsx'

import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Box, Typography, Stack, Chip } from '@mui/material';

//ICON
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';

export default function DateControl() {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };



    return (
        <>
            <style>
                {`
                            * {
                                font-family: 'Prompt', sans-serif;
                                font-style: normal;
                            }
                            `}
            </style>
            <Box style={{
                zIndex: 10,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '5%'
            }}>
                <Stack className='Stack'
                    sx={{
                        position: 'absolute',
                        zIndex: 10,
                        bottom: '90px',
                        left: '50%',
                        // transform: 'translate(-50%, -50%)',
                        transform: 'translate(-50%)',
                    }}
                    direction="row" spacing={1}>
                    <Chip
                        // onClick={insertClinic}
                        size="medium"
                        sx={{
                            boxShadow: 'inset 0px 3.88883px 3.88883px rgba(0, 0, 0, 0.3)',
                            background: 'linear-gradient(50deg, #FF8A00 10%, #FFBC55 65%)',
                        }}
                        icon={<DeviceThermostatOutlinedIcon
                            style={{
                                color: '#9BB0C1',
                                borderRadius: '50%',
                                background: '#fff',
                                boxShadow: 'inset 0px 1px 2.5px rgba(0, 0, 0, 0.5)',
                                padding: '2px',
                            }} />}

                        label={
                            <span id='LyrName' style={{ color: 'white', textShadow: '0.25px 0.25px white, -0.5px 0.2px #3e3e3e' }}>
                                Urban Heat Island Index(UHI)
                            </span>
                        }
                    />
                    <Chip
                        // onClick={insertHealthSt}
                        size="medium"
                        sx={{
                            boxShadow: '3px 3px 2.5px 0.25px rgba(255, 100, 0, 0.5)',
                            background: 'linear-gradient(50deg, #FF8A00 50%, #FFBC57 80%)',
                        }}
                        icon={
                            <DeviceThermostatOutlinedIcon
                                style={{
                                    color: '#387ADF',
                                    borderRadius: '50%',
                                    background: '#fff',
                                    boxShadow: 'inset 0px 1px 2.5px rgba(0, 0, 0, 0.5)',
                                    padding: '2px',
                                }}
                            />
                        }
                        label={
                            <span id="LyName" style={{ color: 'white' }}>
                                Urban Thermal Field Variance Index (UTFVI)
                            </span>
                        }
                    />
                    {/* label="Urban Thermal Field Variance Index (UTFVI)" style={{ color: 'white', }} /> */}
                </Stack>
                <Box>
                    <MobileStepper
                        variant="progress"
                        steps={17}
                        position="static"
                        activeStep={activeStep}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            height: '75px',
                            padding: '0',
                            maxWidth: '700px',
                            minWidth: '400px',
                            borderRadius: '18px',
                            flexGrow: 1,
                            zIndex: 15,
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bottom: '5%',
                            "& .MuiLinearProgress-root.MuiLinearProgress-colorPrimary.MuiLinearProgress-determinate.MuiMobileStepper-progress.css-1be5mm1-MuiLinearProgress-root-MuiMobileStepper-progress": {
                                backgroundColor: 'lightgrey',
                                width: '500px',
                                height: '5px',
                                zIndex: 0,
                                borderRadius: '15px',
                                "@media (max-width: 1024px)": {
                                    maxWidth: '70%',
                                },
                                "@media (max-width: 768px)": {
                                    maxWidth: '50%',
                                },
                                "@media (max-width: 480px)": {
                                    maxWidth: '40%',
                                },
                            },
                            "& .MuiLinearProgress-bar.MuiLinearProgress-barColorPrimary.MuiLinearProgress-bar1Determinate": {
                                backgroundColor: '#FFB200',
                                borderRadius: '20px'
                            }
                        }}
                        nextButton={
                            <Button
                                size="small"
                                onClick={handleNext}
                                disabled={activeStep === 16}
                            >
                                {theme.direction === 'rtl' ? (
                                    <ArrowCircleLeftIcon sx={{ color: activeStep === 0 ? 'rgba(128, 128, 128, 0.5)' : '#FF9900', fontSize: '3rem' }} />
                                ) : (
                                    <ArrowCircleRightIcon sx={{ color: '#FF9900', fontSize: '3rem' }} />
                                )}
                            </Button>
                        }
                        backButton={
                            <Button
                                size="small"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                                sx={{
                                    margin: '0',
                                    width: '50px',
                                }}
                            >
                                {theme.direction === 'rtl' ? (
                                    <ArrowCircleRightIcon sx={{ color: activeStep === 0 ? 'rgba(128, 128, 128, 0.5)' : '#FF9900', fontSize: '3rem' }} />
                                ) : (
                                    <ArrowCircleLeftIcon sx={{ color: activeStep === 0 ? 'rgba(128, 128, 128, 0.5)' : '#FF9900', fontSize: '3rem' }} />
                                )}
                            </Button>
                        }
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            textAlign: 'center',
                            color: '#7a7a7a',
                            zIndex: 15,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <Typography id="LyrDate" className='dateTimeUpdate' variant="subtitle1" display="block"
                            sx={{ fontFamily: `'Prompt', sans-serif` }}>
                            ข้อมูลวันที่ XX/XX/XXXX เวลา XX:XX น.
                        </Typography>
                    </Box>
                </Box >
            </Box >
        </>
    );
}