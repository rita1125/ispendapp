import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 多語系
import { FaPlus } from "react-icons/fa6";

const CreateAccountPage = ({ setRefresh }) => {

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});  //表單錯誤驗證
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  const navigate = useNavigate();

  //多語系
  const { t } = useTranslation(); 

  //新增表單
  const dataSubmit = (e) => {
    e.preventDefault();

    // 重置表單錯誤狀態
    setErrors({});
    // 驗證輸入
    const newErrors = {};
    if (!title) newErrors.title = t('請輸入名稱');
    if (!type) newErrors.type = t('請選擇一個類別');
    if (!cost || isNaN(cost) || cost < 0) newErrors.cost = t('請輸入有效的金額');
    // 有錯誤就返回
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    //axios.post('http://localhost:5001/accounts/create', { title, type, cost, date },{
    axios.post(`${apiUrl}/accounts/create`, { title, type, cost, date },{
        headers: {
          'Content-Type': 'application/json',
        }
    })
    .then(response => {
      //console.log('creating successful, going to home');
      setRefresh(refresh => refresh + 1);
      navigate('/');  //回首頁
    })
    .catch(error => console.error('error!create! ', error));
  };

  return (
      <div className="container">
        <Helmet>
          <title>{t('新增消費')}</title>
          <meta name="description" content={t('記錄您的消費')} />
        </Helmet>
        <div className="flex items-center justify-center text-center text-gray-100 font-bold text-2xl py-6"><FaPlus className='mr-1'/>{t('新增消費')}</div>
        <form onSubmit={dataSubmit} className="space-y-4">
          <div>
            <input className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-100 focus:outline focus:outline-5 focus:outline-sky-100 sm:text-sm ${errors.title ? 'border-orange-300' : ''}`}
                   type="text"
                   value={title}
                   onChange={(e) => setTitle(e.target.value)}
                   placeholder={t('請輸入消費名稱')}
            />
            {/* 表單錯誤驗證 */}
            {errors.title && <div className="text-amber-400 text-sm pl-3 leading-7">{errors.title}</div>}
          </div>

          <div>
            <select className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-100 focus:outline focus:outline-5 focus:outline-sky-100 sm:text-sm ${errors.type ? 'border-orange-300' : ''}`}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
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
            <input className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-100 focus:outline focus:outline-5 focus:outline-sky-100 sm:text-sm ${errors.cost ? 'border-orange-300' : ''}`}
                   type="number"
                   value={cost}
                   onChange={(e) => setCost(e.target.value)}
                   placeholder={t('請輸入消費金額')}
            />
            {/* 表單錯誤驗證 */}
            {errors.cost && <div className="text-amber-400 text-sm pl-3 leading-7">{errors.cost}</div>}
          </div>

          <div>
            {/* <input
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-700 focus:ring-sky-700 sm:text-sm"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            /> */}
             <input id="date"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-100 focus:outline focus:outline-5 focus:outline-sky-100 sm:text-sm"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder={t('date_placeholder')}  
              />
          </div>

          <div>
            <button className="w-full rounded-md bg-cyan-600 py-2 px-4 text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300">
            {t('送出資料')}
            </button>
          </div>
        </form>
      </div>
  );
};

export default CreateAccountPage;