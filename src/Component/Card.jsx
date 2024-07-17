import * as React from 'react';
import { useEffect, useState } from 'react'
import axios from 'axios';
import './Map.jsx'
// import './Card.css'

import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';

import Legend from '/src/Icon/legend.svg'

export default function MediaCard() {


    return (

        <>
            <div style={{ position: 'absolute', right: '1rem', top: '5rem' }}>
                <style>
                    {`
                            * {
                                font-family: 'Prompt', sans-serif;
                                font-style: normal;
                            }
                            `}
                </style>

                <img src={Legend} style={{ width: '355px', position: 'relative', top: 0, left: 0, right: '1rem', zIndex: 10 }}></img>
                <Card
                    sx={{
                        maxWidth: '355px',
                        maxHeight: '155px',
                        certicleAlign: 'middle',
                        position: 'relative',
                        zIndex: 10
                    }}
                >
                    <CardActionArea>
                        <CardContent sx={{ top: '0.5rem', padding: '0.5rem' }}>
                            <span id='location' style={{ fontSize: '16px', fontWeight: 'Bold' }} ></span><br />
                            <span style={{ fontSize: '14px' }}> สภาพอากาศวันนี้ </span><br />
                            <span style={{ fontSize: '12px' }}> ค่า PM2.5</span><br />
                            <span id='value' style={{ fontWeight: 'bold', fontSize: '30px' }}></span>
                            <span style={{ fontSize: '10px' }}>µg./m3</span>
                            <span id='level'></span><br />
                            <span id='update' style={{ fontSize: '12px', color: '#a6a6a6' }}></span>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
        </>

    );
}