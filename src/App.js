import React, { useState, useEffect } from 'react';

import {useRoutes } from 'react-router-dom';
import axios from 'axios';
import Menu from './components/menu'; 
import routes from './routes/routes';  
import './styles/global.css'; 
import { Helmet } from 'react-helmet';          // 設置<head>標籤內容
import './i18n';                                // 初始化，i18n 只需要初始化一次
import { useTranslation } from 'react-i18next'; // 多語系
//import { twMerge } from 'tailwind-merge';

//根據條件動態變更按鈕樣式
// function MyButton({ isPrimary }) {
//   const buttonClass = twMerge(
//     'px-4 py-2 rounded text-white',            // 基本樣式
//     isPrimary ? 'bg-blue-500' : 'bg-gray-500', // 根據條件變更背景顏色
//     'hover:bg-opacity-75'                      // 不管條件怎樣都適用的樣式
//   );

//   return <button className={buttonClass}>按鈕</button>;
// }

// import clsx from 'clsx';
// const isActive = true;
// const isDisabled = false;
// const className1 = clsx(
//   'btn',
//   isActive && 'btn-active',   // 如果 isActive 為 true，加入 'btn-active'
//   isDisabled && 'btn-disabled'  // 如果 isDisabled 為 false，忽略 'btn-disabled'
// );
// const className2 = clsx({
//   'btn': true,             // 加入 'btn'
//   'btn-active': true,      // 加入 'btn-active'
//   'btn-disabled': false,   // 忽略 'btn-disabled'
// });

function App() {
  const [accounts, setAccounts] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [refresh, setRefresh] = useState(0);
  //React這變數設定應用連接後端 API 的 URL，指後端伺服器的地址。前綴 REACT_APP_ 是 React 規定，所有以這個前綴命名的變數會自動被讀取並注入應用中
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001'; 

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/accounts?timestamp=${new Date().getTime()}`);
        //const response = await axios.get('http://localhost:5001/accounts');
        //各消費
        setAccounts(response.data);
        //總消費
        const total = response.data.reduce((itemPrice, eachAccount) => { return itemPrice + Number(eachAccount.cost)}, 0);
        setTotalCost(total);
      } catch (error) {
        console.error('error!get accounts!', error);
      }
    };
    getData();
  }, [refresh,apiUrl]);

  //路由
  const allRoutes = useRoutes(routes(accounts, totalCost, setAccounts, setTotalCost, setRefresh));
  
  //多語系
  //無需在每子組件重新初始化 i18n，只需在父組件 App.js初始化一次，所有子組件都可通過 useTranslation 鉤子獲取翻譯
  const { t, i18n } = useTranslation();  // useTranslation 是 react-i18next 鉤子，t : 翻譯函數，i18n : 提供方法來更改語言
  const langGetChange = (lang) => {
    i18n.changeLanguage(lang);           // 方法 : i18n.changeLanguage('語言代碼') 
  };


  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="grow"> 
        <Helmet>
          <title>{t('記錄您的消費')}</title>
          <meta name="description" content={t('使用React與Node.js進行全端開發實作，此專案提供記帳、更新與刪除消費等操作')} />
          <meta property="og:title" content={t('記錄您的消費')} />
          <meta property="og:description" content={t('使用React與Node.js進行全端開發實作，此專案提供記帳、更新與刪除消費等操作')} />
          <meta property="og:image" content="https://spending-front-6701f9791b04.herokuapp.com/og_image.png" />
          <meta property="og:url" content="https://spending-front-6701f9791b04.herokuapp.com" />
          <meta property="og:type" content="website" />
        </Helmet>
        
        {/* 回首頁 & 選單 */}
        <nav>
          <Menu langGetChange={langGetChange}/>
        </nav>
        <header>
          <div className="bg-white bg-opacity-45 py-8 w-full">
            <div className="container mx-auto px-4 text-left">
              <h1 className="text-5xl font-bold text-sky-900">{t('記錄您的消費')}</h1>
              <p className="mt-4 text-xl text-sky-100">{t('提供記帳用途，掌握財務。可以進行新增消費、更新與刪除消費等操作')}</p>
            </div>
          </div>
        </header>

        {/* 路由 & 組件 */}
        <main>
          <div className="container mx-auto px-4 pb-6 sm:py-5 w-full h-auto">
            {allRoutes}
            {/* <Routes>
              <Route path="/" element={<Home 
                accounts={accounts} 
                totalCost={totalCost} 
                deleteAccount={deleteAccount} 
                setAccounts={setAccounts} 
                setTotalCost={setTotalCost} 
                setRefresh={setRefresh} 
              />} />
              <Route path="/accounts/create" element={<CreateAccountPage setRefresh={setRefresh} />} />
              <Route path="/accounts/:id/update" element={<UpdateAccountPage setRefresh={setRefresh}/>} />
            </Routes> */}
          </div>
        </main>
      </div>
      <footer className="bg-[#34607d] sm:bg-sky-950 text-white py-4 text-center">
        <p>&copy; 2024 {t('記錄您的消費')}</p>
      </footer>
    </div>
  );
}

export default App;