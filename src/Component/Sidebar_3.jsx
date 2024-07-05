import React from 'react'
import './Sidebar_3.css'
import { colors } from '@mui/material'

import Home from '/src/Icon/home.svg'
import Logo from '/src/Icon/logo_app.svg'
import Mask from '/src/Icon/mask.svg'
import Sun from '/src/Icon/sun.svg'
import Mosquito from '/src/Icon/mosquito.svg'
import MophLogo from '/src/Icon/moph_logo.svg'
import GistdaLogo from '/src/Icon/gistda_logo.svg'
import PcLogo from '/src/Icon/pc.png'
import MeteoLogo from '/src/Icon/meteo.png'
import Gistda from '/src/Icon/Gistda_LOGO.png'

import Contact from '/src/Icon/contact.svg'
import Info from '/src/Icon/info.svg'
import Pdf from '/src/Icon/pdf.svg'
import Youtube from '/src/Icon/youtube.svg'

const Sidebar = () => {
    return (

        <div id="nav-bar">

            <input id="nav-toggle" type="checkbox" />
            <div id="nav-header">
                <div className="logo">
                    <img src={Logo} alt='icon' className='Logo' style={{ width: '54px', marginLeft: '1rem', verticalAlign: 'middle' }}
                    ></img>
                </div>
                <a id="nav-title">
                    <h1 className='LifeD'>
                        LifeDee
                    </h1>
                    <p style={{ fontSize: '14px', color: 'black' }}>สุขภาพดีเริ่มต้นที่แอปไลฟ์ดี</p>
                </a>
                <label htmlFor="nav-toggle"><span id="nav-toggle-burger"></span></label>

            </div>
            <div id="nav-content">
                <hr />
                <div className="nav-button">
                    <img src={Home} alt='icon' className='Home' style={{ marginLeft: '0.5rem', width: '35px', verticalAlign: 'middle', alignContent: 'center' }}></img>
                    <span href='#'>
                        หน้าแรก
                    </span>
                </div>
                <div className="nav-button">
                    <img src={Mask} alt='icon' className='Mask' style={{ marginLeft: '0.5rem', width: '35px', verticalAlign: 'middle', alignContent: 'center' }}></img>
                    <span href='#'>
                        โรคระบบทางเดินหายใจ
                    </span>
                </div>
                <div className="nav-button">
                    <img src={Sun} alt='icon' className='Sun' style={{ marginLeft: '0.5rem', width: '35px', verticalAlign: 'middle', alignContent: 'center' }}></img>
                    <span href='#'>
                        โรคฮีทสโตรก
                    </span>
                </div>
                <div className="nav-button">
                    <img src={Mosquito} alt='icon' className='Mosquito' style={{ marginLeft: '0.5rem', width: '35px', verticalAlign: 'middle', alignContent: 'center' }}></img>
                    <span href='#'>
                        โรคไข้เลือดออก
                    </span>
                </div>
                <hr />

                <div className="nav-button">
                    <img src={Contact} alt='icon' className='Contact' style={{ marginLeft: '0.5rem', width: '35px', verticalAlign: 'middle', alignContent: 'center' }}></img>
                    <span href="#" style={{ color: '#000000' }}>
                        ข้อมูลติดต่อ
                    </span>
                </div>
                <div className="nav-button">
                    <img src={Info} alt='icon' className='Info' style={{ marginLeft: '0.5rem', width: '35px', verticalAlign: 'middle', alignContent: 'center' }}></img>
                    <span href="#" style={{ color: '#000000' }}>
                        เกี่ยวกับแอปพลิเคชัน
                    </span>
                </div>
                <div className="nav-button">
                    <img src={Pdf} alt='icon' className='Pdf' style={{ marginLeft: '0.5rem', width: '35px', verticalAlign: 'middle', alignContent: 'center' }}></img>
                    <span href="#" style={{ color: '#000000' }}>
                        คู่มือการใช้งาน
                    </span>
                </div>
                <div className="nav-button">
                    <img src={Youtube} alt='icon' className='Youtube' style={{ marginLeft: '0.5rem', width: '35px', verticalAlign: 'middle', alignContent: 'center' }}></img>
                    <span href="#" style={{ color: '#000000' }}>
                        วีดีโอสาธิตการใช้งาน
                    </span>
                </div>

                <div id="nav-content-highlight"></div>
            </div>
            <input id="nav-footer-toggle" type="checkbox" />

            <div id="nav-footer">
                <div id="nav-footer-heading">
                    <div id="nav-footer-avatar"><img src={Logo} style={{ filter: 'brightness(0) invert(1)' }}
                    /></div>
                    {/* <div id="nav-footer-avatar"><img src="https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547" /></div> */}
                    <div id="nav-footer-titlebox">
                        <a id="nav-footer-title" href="https://codepen.io/uahnbu/pens/public" target="_blank">LifeDee</a>
                        <br />
                        <span id="nav-footer-subtitle">แหล่งที่มา</span>
                    </div>
                    <label htmlFor="nav-footer-toggle"><i className="fas fa-caret-up"></i></label>
                </div>
                <div id="nav-footer-content">
                    <span style={{ alignContent: 'center' }}>สนับสนุนข้อมูลโดย</span>

                    <div className="logo-container">
                        <img
                            src={MophLogo}
                            alt="icon"
                            className="MophLogo"
                            style={{ width: '45px', marginLeft: '1rem', verticalAlign: 'middle' }}
                        />
                        <img
                            src={Gistda}
                            alt="icon"
                            className="Gistda"
                            style={{ width: '55px', marginLeft: '1rem', verticalAlign: 'middle' }}
                        />
                        <img
                            src={PcLogo}
                            alt="icon"
                            className="Logo"
                            style={{ width: '30px', marginLeft: '1rem', verticalAlign: 'middle' }}
                        />
                        <img
                            src={MeteoLogo}
                            alt="icon"
                            className="Logo"
                            style={{ width: '30px', marginLeft: '1rem', verticalAlign: 'middle' }}
                        />
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Sidebar