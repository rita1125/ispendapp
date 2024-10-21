import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 多語系
import { FaPlus } from "react-icons/fa6";

function Header({ langGetChange }) {
    //選單
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    //判斷目前路徑是否為首頁
    const location = useLocation();  //當前路徑
    const isHomepage = location.pathname === '/';

    //多語系
    const { t } = useTranslation(); 

    // ref for menu container
    const menuRef = useRef(null);

    const changeButton = (languag) => {
        if (languag) langGetChange(languag);
        setIsMenuOpen(false); // Hide menu after selection
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="bg-sky-950 text-white">
                <div className="container px-4 py-2 flex items-center justify-between">
                    <div className="inline-flex items-center">
                        {!isHomepage && (
                            <Link className="text-sky-300 text-xl font-bold ml-2" to="/">{t('回首頁')}</Link>
                        )}
                    </div>
                    <div className="inline-flex items-center">
                        {/* 電腦選單 */}
                        <div className="hidden md:inline-flex items-center space-x-4">
                            <Link to="/accounts/create">
                                <button className="px-3 py-2 flex items-center bg-cyan-600 text-white rounded-md hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300">
                                    <FaPlus className='mr-1'/>  {t('新增消費')}
                                </button>
                            </Link>
                            <button onClick={() => langGetChange('en')} className="text-white">English</button>
                            <button onClick={() => langGetChange('tw')} className="text-white">中文</button>
                        </div>

                        {/* 手機選單按鈕 */}
                        <div>
                            <button onClick={menu} className="navbar-toggle md:hidden">
                                <span className="sr-only">Menu</span>
                                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                                <span className="block w-6 h-0.5 bg-white mb-1"></span>
                                <span className="block w-6 h-0.5 bg-white"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* 手機選單內容 */}
            <div ref={menuRef} className={`${isMenuOpen ? 'absolute' : 'hidden'} text-center lg:hidden w-[150px] bg-cyan-600 z-50 right-0`}>
                <Link to="/accounts/create">
                    <div onClick={() => changeButton()} className="w-[150px] px-4 py-2 flex items-center justify-center bg-cyan-600 text-white rounded-md hover:bg-cyan-500 focus:ring-cyan-600">
                        <FaPlus className='mr-1'/> {t('新增消費')}
                    </div>
                </Link>
                <div onClick={() => changeButton('en')} className="w-[150px] px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 focus:ring-cyan-600">English</div>
                <div onClick={() => changeButton('zh')} className="w-[150px] px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 focus:ring-cyan-600">中文</div>
            </div>
        </>
    );
}

export default Header;