import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Box, Typography, Stack, Chip } from '@mui/material';

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
                bottom: '5%',
                backgroundColor: 'red'
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
                            bgcolor: 'white',
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)'
                        }}
                        icon={<ArrowCircleLeftIcon
                            style={{
                                color: 'white',
                                borderRadius: '50%',
                                backgroundColor: '#1DBEB8',
                                padding: '2px',
                            }} />}
                        label="Urban Heat Island Index(UHI)" />

                    <Chip
                        // onClick={insertHealthSt}
                        size="medium"
                        sx={{
                            bgcolor: 'white',
                            boxShadow: '0px 3.88883px 3.88883px rgba(0, 0, 0, 0.25)'
                        }}
                        icon={<ArrowCircleLeftIcon
                            style={{
                                color: 'white',
                                borderRadius: '50%',
                                backgroundColor: '#2196F3',
                                padding: '2px',
                            }} />}
                        label="Urban Thermal Field Variance Index (UTFVI)" />
                </Stack>
                <Box>
                    <MobileStepper
                        variant="progress"
                        steps={17}
                        position="static"
                        activeStep={activeStep}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
                                backgroundColor: '#FF4500',
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
                            // fontSize: '0.8rem',
                            zIndex: 15,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <Typography className='dateTimeUpdate' variant="subtitle1" display="block"
                            sx={{ fontFamily: `'Prompt', sans-serif` }}>
                            ข้อมูลวันที่ XX/XX/XXXX เวลา XX:XX น.
                        </Typography>
                    </Box>
                </Box >
            </Box >
        </>
    );
}