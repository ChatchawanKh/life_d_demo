import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

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
        <MobileStepper
            variant="progress"
            steps={17}
            position="static"
            activeStep={activeStep}
            sx={{
                width: '30%',
                maxWidth: '600px',
                minWidth: '400px',
                borderRadius: '18px',
                flexGrow: 1, zIndex: '15', position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '5%'
            }}
            nextButton={
                <Button size="small" onClick={handleNext} disabled={activeStep === 17}>
                    ถัดไป
                    {theme.direction === 'rtl' ? (
                        <KeyboardArrowLeft />
                    ) : (
                        <KeyboardArrowRight />
                    )}
                </Button>
            }
            backButton={
                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    {theme.direction === 'rtl' ? (
                        <KeyboardArrowRight />
                    ) : (
                        <KeyboardArrowLeft />
                    )}
                    ก่อนหน้า
                </Button>
            }
        />
    );
}