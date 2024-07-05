import React, { useState } from 'react'
import './Sidebar_edt.css'

import OpenBtn from '/src/Icon/right_arrow.svg'
import CloseBtn from '/src/Icon/left_arrow.svg'


import Home from '/src/Icon/home.svg'
import Logo from '/src/Icon/logo_app.svg'
import Mask from '/src/Icon/mask.svg'
import Sun from '/src/Icon/sun.svg'
import Mosquito from '/src/Icon/mosquito.svg'
import MophLogo from '/src/Icon/moph_logo.svg'
import GistdaLogo from '/src/Icon/gistda_logo.svg'

import Contact from '/src/Icon/contact.svg'
import Info from '/src/Icon/info.svg'
import Pdf from '/src/Icon/pdf.svg'
import Youtube from '/src/Icon/youtube.svg'



const Sidebar = () => {

    return (
        <div className='sidebar'>
            <div className="sidebar-list1">
                {/* LOGO */}
                <div className="logoContainer">
                    <div className="logo">
                        <img src={Logo} alt='icon' className='Logo' style={{ width: '54px', marginLeft: '1rem', verticalAlign: 'middle' }}
                        ></img>
                    </div>
                    <div className='text-logo'>
                        <h1 className='LifeD'>
                            LifeDee
                        </h1>
                        <p style={{ fontSize: '14px' }}>สุขภาพดีเริ่มต้นที่แอปไลฟ์ดี</p>
                    </div>
                </div>
                <div className="burgerTrigger">
                    <img src={CloseBtn} alt='icon' className='CloseBtn' style={{ width: '30px', marginLeft: '1rem', verticalAlign: 'middle' }}
                    ></img>
                </div>
                <hr className='divider' />
                {/* LOGO */}

                {/* 1st List */}
                <div className="list">
                    <ul className="listContainer">
                        <li>
                            <img src={Home} alt='icon' className='Home' style={{ marginLeft: 'auto', verticalAlign: 'middle', alignContent: 'center' }}
                            ></img>
                            <a href='#'>
                                หน้าแรก
                            </a>
                        </li>

                        <li>
                            <img src={Mask} alt='icon' className='Mask' style={{ marginLeft: 'auto', verticalAlign: 'middle', alignContent: 'center' }}
                            ></img>
                            <a href='#'>
                                โรคระบบทางเดินหายใจ
                            </a>
                        </li>

                        <li>
                            <img src={Sun} alt='icon' className='Sun' style={{ marginLeft: 'auto', verticalAlign: 'middle', alignContent: 'center' }}
                            ></img>
                            <a href='#'>
                                โรคฮีทสโตรก
                            </a>
                        </li>

                        <li>
                            <img src={Mosquito} alt='icon' className='Mosquito' style={{ marginLeft: 'auto', verticalAlign: 'middle', alignContent: 'center' }}
                            ></img>
                            <a href='#'>
                                โรคไข้เลือดออก
                            </a>
                        </li>
                    </ul>

                </div>
            </div>
            <hr className='divider-list' />

            <div className="sidebar-list2">

                {/* 2nd List */}
                <div className="logo-banner">
                    <img src={Logo} alt='icon' className='Logo' style={{ width: '30px', marginLeft: '1rem', verticalAlign: 'middle', alignContent: 'center' }}
                    ></img>
                    <img src={MophLogo} alt='icon' className='MophLogo' style={{ width: '45px', marginLeft: '1rem', verticalAlign: 'middle', alignContent: 'center' }}
                    ></img>
                    <img src={GistdaLogo} alt='icon' className='GistdaLogo' style={{ width: '75px', marginLeft: '1rem', verticalAlign: 'middle', alignContent: 'center' }}
                    ></img>
                </div>
                <div className="list-2">
                    <div className="list-2-menu">
                        <ul className="listContainer">
                            <li>
                                <img src={Contact} alt='icon' className='Contact' style={{ width: '20px', marginLeft: '0.5rem', verticalAlign: 'middle', alignContent: 'center' }}
                                ></img>
                                <a href='#'>
                                    ข้อมูลติดต่อ
                                </a>
                            </li>
                            <li>
                                <img src={Info} alt='icon' className='Info' style={{ width: '20px', marginLeft: '0.5rem', verticalAlign: 'middle', alignContent: 'center' }}
                                ></img>
                                <a href='#'>
                                    เกี่ยวกับแอปพลิเคชัน
                                </a>
                            </li>

                            <li>
                                <img src={Pdf} alt='icon' className='Pdf' style={{ width: '20px', marginLeft: '0.5rem', verticalAlign: 'middle', alignContent: 'center' }}
                                ></img>
                                <a href='#'>
                                    คู่มือการใช้งาน
                                </a>
                            </li>

                            <li>
                                <img src={Youtube} alt='icon' className='Youtube' style={{ width: '20px', marginLeft: '0.5rem', verticalAlign: 'middle', alignContent: 'center' }}
                                ></img>
                                <a href='#'>
                                    วีดีโอสาธิตการใช้งาน
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>
            <div className="burgerTrigger">
                <img src={CloseBtn} alt='icon' className='CloseBtn' style={{ width: '30px', marginLeft: '1rem', verticalAlign: 'middle' }}
                ></img>
            </div>
        </div >



    )
}

export default Sidebar