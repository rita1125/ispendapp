// src/pages/UpdateAccountPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next'; // 多語系
import { FaPenToSquare } from "react-icons/fa6";


const UpdateAccountPage = ({ setRefresh }) => {

  const { id } = useParams(); // 從 URL 獲取消費 ID
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    title: '',
    type: '',
    cost: '',
    date: ''
  });
  const [errors, setErrors] = useState({});  //表單錯誤驗證
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  //多語系
  const { t } = useTranslation(); 

  useEffect(() => {
    // fetch(`http://localhost:5001/accounts/${id}`)
    //   .then(res => res.json())
    //   .then(data => setAccount(data))
    //axios.get(`http://localhost:5001/accounts/${id}`)
    axios.get(`${apiUrl}/accounts/${id}`)
    .then(res => setAccount(res.data))
    .catch(err => console.error(err));
    
  }, [id]);

  //onChange
  const dataChange = (e) => {
    //console.log(e)
    const { name, value } = e.target;
    //console.log(name,value)
    setAccount(preState => ({
      ...preState,
      [name]: value
    }));
  };

  //更新表單
  const dataSubmit = (e) => {
    e.preventDefault();

    // 重置表單錯誤狀態
    setErrors({});
    // 驗證輸入
    const newErrors = {};
    if (!account.title) newErrors.title = t('請輸入名稱');
    if (!account.type) newErrors.type =  t('請選擇一個類別');
    if (!account.cost || isNaN(account.cost) || account.cost < 0) newErrors.cost = t('請輸入有效的金額') ;
    // 有錯誤就返回
    //console.log(Object.keys(newErrors));
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      return;
    }

    //account以 JSON 格式發送到伺服器
    //axios.post(`http://localhost:5001/accounts/${id}/update`, account, {
    axios.post(`${apiUrl}/accounts/${id}/update`, account, {
      //指定請求的標頭（HTTP headers）。'Content-Type': 'application/json' 表示發送的數據是 JSON 格式
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      //console.log('Updating successful, going to home');
      setRefresh(refresh => refresh + 1);
      navigate('/');
    })
    .catch(error => console.error('error!update!', error));
  };
  // const dataSubmit = (e) => {
  //   e.preventDefault();
  //   fetch(`http://localhost:500/accounts/${id}/update`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(account),
  //   })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.json();
  //   })
  //   .then(() => { 
  //     console.log('Updating successful, going to home');
  //     setRefresh(refresh => refresh + 1);
  //     navigate('/');
  //   })
  //   .catch(error => console.error('error! ', error));
  // };

  return (
    <div className="container">
      <Helmet>
      <title>{t('更新消費')}</title>
      <meta name="description" content={t('記錄您的消費')} />
      </Helmet>
      <div className="flex items-center justify-center text-center text-gray-100 font-bold text-2xl py-6"><FaPenToSquare className='mr-1'/>{t('更新消費')}</div>
      <form onSubmit={dataSubmit} className="space-y-4">
          <div>
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              type="text"
              name="title"
              value={account.title}
              onChange={dataChange}
              placeholder={t('請輸入消費名稱')}
            />
            {/* 表單錯誤驗證 */}
            {errors.title && <div className="text-amber-400 text-sm pl-3 leading-7">{errors.title}</div>}
          </div>

          <div>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              name="type"
              value={account.type}
              onChange={dataChange}
            >
              <option value="">{t('請選擇類別')}</option>
              <option value={t('美食')}>{t('美食')}</option>
              <option value={t('生活用品')}>{t('生活用品')}</option>
              <option value={t('房租')}>{t('房租')}</option>
              <option value={t('交通')}>{t('交通')}</option>
              <option value={t('娛樂')}>{t('娛樂')}</option>
            </select>
             {/* 表單錯誤驗證 */}
             {errors.type && <div className="text-amber-400 text-sm pl-3 leading-7">{errors.type}</div>}
          </div>
          <div>
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              type="number"
              name="cost"
              value={account.cost}
              onChange={dataChange}
              placeholder={t('請輸入消費金額')}
            />
            {/* 表單錯誤驗證 */}
            {errors.cost && <div className="text-amber-400 text-sm pl-3 leading-7">{errors.cost}</div>}
          </div>
          <div>
            <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
              type="date"
              name="date"
              value={account.date}
              onChange={dataChange}
            />
          </div>
          <div>
            <button
              className="w-full rounded-md bg-gray-500 py-2 px-4 text-white hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              type="submit"
            >
              {t('送出資料')}
            </button>
          </div>
      </form>
    </div>
  );
};

export default UpdateAccountPage;