import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; //多語系
import ReactPaginate from 'react-paginate';     //分頁
import { FaBahai, FaRectangleXmark , FaDollarSign, FaPenToSquare, FaRegCalendarDays, FaReceipt, FaList, FaCircleArrowLeft, FaCircleArrowRight  } from "react-icons/fa6"; //Font Awesome 6
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';   //UI
import { Doughnut } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = ({ accounts, totalCost, deleteAccount, setAccounts, setTotalCost, setRefresh }) => {
    
    const { t } = useTranslation();                     //多語系
    const [visible, setVisible] = useState(false);      //TOP按鈕
    const [selectMonth, setSelectMonth] = useState(''); //選擇月份
    const [selectType, setSelectType] = useState('');   //選擇類型
    const [nowPage, setNowPage] = useState(0);          //0當第1頁
    const itemsInPage = 5; 
    const [openDialog, setOpenDialog] = useState(false);          //刪除按鈕的確認框
    const [accountIdDelete, setAccountIdDelete] = useState(null); //要被刪除的消費紀錄

    //TOP按鈕
    useEffect(() => {
        // 不是直接設置 setVisible 為 true，而是根據條件 window.scrollY > 150 來動態決定設置 true 或 false
        const topBtn = () => setVisible(window.scrollY > 100);
        window.addEventListener('scroll', topBtn);
        //清理監聽
        return ( () => window.removeEventListener('scroll', topBtn) );
    }, []);

    // 依月份&類型篩選消費紀錄
    const selectAccounts = accounts.filter( (e) => {
                                const accountMonth = new Date(e.date).getMonth() + 1;   //getMonth : 0-11月
                                const getMonth = selectMonth === '' || accountMonth === parseInt(selectMonth);
                                const getType = selectType === '' || e.type === selectType;
                                return getMonth && getType;
                            });
                            //console.log(selectAccounts);
    
    //月份&類型改變，重設當前頁碼為 0，0當第1頁
    useEffect(() => {
        setNowPage(0);  
    }, [selectMonth, selectType]);

    //重算總消費金額
    const newTotal = selectAccounts.reduce((itemPrice, eachAccount) => { return itemPrice + Number(eachAccount.cost)}, 0);
    useEffect(() => {
        if( selectAccounts.length === 0 ){
            setTotalCost(0);
        }else{
            setTotalCost(newTotal);
        }
       
    }, [newTotal, setTotalCost,selectAccounts])

    // 計算當前頁的資料
    const pageCount = Math.ceil(selectAccounts.length / itemsInPage);  //計算整筆資料分成幾頁
    const newAccounts = selectAccounts.slice(nowPage * itemsInPage, (nowPage + 1) * itemsInPage);  //slice(起始index，結束index前停止提取) 

    const pageClick = (data) => {
        //console.log(data)  //{selected: 0}、{selected: 1}...
        setNowPage(data.selected);
        window.scrollTo({ top: 0, behavior: 'auto' }); 
    };

    // 圖表，計算每種類型的消費總金額
    const chartData = ()=>{
        const typeCost = {};
        selectAccounts.forEach((account) => {
                                    //看 typeCost中是否已有 account.type這類型的金額，已經存在就用該值，無則 0
            typeCost[account.type] = (typeCost[account.type] || 0) + Number(account.cost);  
        });
        //console.log( typeCost)
        return {
            labels: Object.keys(typeCost).map(key => t(`${key}`)),
            datasets: [{
                label: t('金額'),
                data: Object.values(typeCost),
                backgroundColor: [ '#e9fbff', '#a5a5a5','#8ecae6','#219ebc','#006a9e'],
            }],
        };
    };
    // 圖表，labels文字顏色跟大小
    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#efefef', // 整體文字顏色
                    font: { size: 18 }
                }
            }
        }
    }

    //刪除按鈕的確認框
    const deleteThis =(accountId)=>{
        setAccountIdDelete(accountId);  
        setOpenDialog(true);  
    }
    const confirmDelete = () => {  //確定要刪除
        if (accountIdDelete) {
            deleteAccount(accountIdDelete, setAccounts, setTotalCost, accounts, setRefresh);
            
            //如果當前頁面無資料 & 頁碼超過總頁數，就前往上一頁
            if(newAccounts.length === 0 && nowPage > 0){
                setNowPage(nowPage - 1);
            }

            setOpenDialog(false);   
        }
      };
    const closeDialog = () => {  //取消刪除
        setOpenDialog(false);
    };
    

                    
    return (
        <>  
            {/* 選擇月份 */}
            <div className="mb-5 pr-9 ml-1 inline-flex items-center text-base md:text-lg mt-5 sm:mt-0">
                <FaRegCalendarDays className='mr-1 text-sky-100 align-middle'/><label htmlFor="month-filter" className="mr-1 md:mr-2 w-[112px] md:w-max text-sky-100 font-bold align-middle">{t('選擇月份')} :</label>
                <select id="month-filter"
                        value={selectMonth}
                        onChange={(e) => setSelectMonth(e.target.value)}
                        className="block w-[135px] rounded-md border-gray-300 shadow-sm focus:border-sky-100 focus:outline focus:outline-5 focus:outline-sky-100 sm:text-sm"
                >
                    <option value="">{t('所有月份')}</option>
                    {[...Array(12).keys()].map(month => (
                        <option key={month + 1} value={month + 1}>
                            {t(`${month + 1}月`)}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* 選擇類型 */}
            <div className="mb-5 ml-1 inline-flex items-center text-base md:text-lg">
                <FaList className='mr-1 text-sky-100'/><label htmlFor="type-filter" className="mr-1 md:mr-2 w-[112px] md:w-max text-sky-100 font-bold">{t('選擇類型')} :</label>
                <select id="type-filter"
                        value={selectType}
                        onChange={(e) => setSelectType(e.target.value)}
                        className="block w-[135px] rounded-md  border-gray-300 shadow-sm focus:border-sky-800 focus:outline focus:outline-5 focus:outline-sky-100 sm:text-sm"
                >
                    <option value="">{t('所有類型')}</option>
                    {[...new Set(accounts.map(account => account.type))].map(type => (
                        <option key={type} value={type} className="hover:bg-blue-700 focus:bg-blue-700 ">
                            {t(type)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col sm:flex-row">
                {/* 表格 */}
                <div className="order-2 sm:-order-none w-full sm:w-3/4 divide-y divide-gray-300">
                    {/* 電腦版消費紀錄標題 */}
                    <div className="hidden md:grid grid-cols-6 gap-4 bg-white bg-opacity-45 py-3 px-6 text-left text-lg font-bold text-gray-200 tracking-wider">
                        <div className='flex items-center'><FaReceipt className='mr-1'/>{t('消費名稱')}</div>
                        <div className='flex items-center'><FaList className='mr-1'/>{t('類型')}</div>
                        <div className='flex items-center'><FaDollarSign className='mr-1'/>{t('金額')}</div>
                        <div className='flex items-center'><FaRegCalendarDays className='mr-1'/>{t('日期')}</div>
                        <div className='flex items-center'><FaBahai className='mr-1'/>{t('操作')}</div>
                    </div>

                    {/* 各個消費紀錄 */}
                    <div>
                    { newAccounts.length === 0 ? 
                        <div className="grid text-lg text-gray-200 bg-white bg-opacity-20 gap-3 py-4 px-6 border-gray-200 border md:border-0 md:border-b hover:bg-sky-900 ">{t('無消費紀錄')}</div>
                        :
                        newAccounts.map((account, index) => (
                            <div key={account.id} className={`grid grid-cols-2 text-base md:text-lg text-gray-200 md:grid-cols-6 md:bg-white md:bg-opacity-20 gap-3 py-4 px-6 border-gray-200 border md:border-0 md:border-b hover:bg-sky-900 ${index % 2 !== 0 && 'bg-white bg-opacity-40'} ${index % 2 === 0 && 'bg-white bg-opacity-20'}`}>
                                <div className="col-span-2 md:col-span-1 leading-6 md:leading-10">
                                    <div className="flex items-center md:hidden text-gray-200 font-bold"><FaReceipt className='mr-1'/>{t('消費名稱')}</div>
                                    {account.title}
                                </div>
                                <div className="col-span-2 md:col-span-1 leading-6 md:leading-10">
                                    <div className="flex items-center md:hidden text-gray-200 font-bold"><FaList className='mr-1'/>{t('類型')}</div>{t(account.type)}
                                </div>
                                <div className="col-span-2 md:col-span-1 leading-6 md:leading-10">
                                    <div className="flex items-center md:hidden text-gray-200 font-bold"><FaDollarSign className='mr-1'/>{t('金額')}</div>{account.cost}
                                </div>
                                <div className="col-span-2 md:col-span-1 leading-6 md:leading-10">
                                    <div className="flex items-center md:hidden text-gray-200 font-bold"><FaRegCalendarDays className='mr-1'/>{t('日期')}</div>{account.date !== 'Invalid date' ? account.date : t('未指定')}
                                </div>
                                <div className="col-span-2 flex items-center md:hidden text-gray-200 font-bold leading-5"><FaBahai className='mr-1'/>{t('操作')}</div>
                                <div className="flex md:col-span-1">
                                    <Link to={`/accounts/${account.id}/update`}>
                                    <button className="px-3 py-2 flex items-center bg-black text-gray-200 text-sm md:text-lg rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                        <FaPenToSquare className='mr-1'/> {t('更新')}
                                    </button>
                                    </Link>
                                </div>
                                <div className="flex md:col-span-1">
                                    <button type="button"
                                            onClick={() => deleteThis(account.id)}
                                            className="px-3 py-2 flex items-center bg-red-800 text-gray-200 text-sm md:text-lg rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-800"
                                    >
                                        <FaRectangleXmark className='mr-1'/>{t('刪除')}
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    </div>

                    {/* 總消費金額 */}
                    <div className="flex md:grid md:col-span-4 md:grid-cols-6 gap-4 bg-white bg-opacity-45 py-3 px-6 text-base md:text-lg text-gray-200 font-bold">
                        <div className="flex md:col-span-2 items-center"><FaDollarSign className='mr-1'/>{t('總消費金額')}</div>
                        <div className="md:col-span-4">{totalCost}</div>
                    </div>

                    {/* 分頁按鈕 : 總頁數 pageCount / 頁面更改時調用的方法onPageChange / li省略號元素標籤上的類別名稱breakClassName*/}
                    <div className="pt-8">
                        {newAccounts.length === 0 ? 
                            <></>
                            :  
                            <ReactPaginate previousLabel={<FaCircleArrowLeft /> }  // <><FaCircleArrowLeft /> {t('上一頁')}</> : 傳遞多個子元素（圖標 & 文字），必須要有一個父級標籤來包裹它們，否則會報錯，因為 JSX 不允許返回多個並列的元素
                                        nextLabel={<FaCircleArrowRight />}
                                        breakLabel={"..."}
                                        breakClassName={"text-xl text-gray-200"}
                                        pageCount={pageCount}            
                                        onPageChange={pageClick}
                                        containerClassName={"inline-flex justify-center items-center w-full text-center pb-5"}
                                        activeClassName={"text-cyan-500 underline"}
                                        previousClassName={"text-2xl text-gray-200 w-min"}
                                        nextClassName={"text-2xl text-gray-200 w-min"}
                                        pageClassName={"text-2xl text-gray-200 w-12"}
                                        disabledClassName={"disabled"}
                            />
                        }
                    </div>
                </div>

                {/* 圖表 */}
                { newAccounts.length === 0 ? "" :
                <div className="order-1 sm:-order-none w-full sm:w-1/4 h-auto pb-5 sm:pb-0 sm:pt-10">
                    <h3 className="text-lg font-bold text-gray-200 text-center">{t('消費類型比例')}</h3>
                    <Doughnut data={chartData()} options={chartOptions} />
                </div>
                }
            </div>
 

            {/* TOP按鈕 */}
            <div className="mx-auto w-16 h-9 absolute left-0 right-0 bg-[#34607d] sm:bg-sky-950 text-white text-center leading-9 cursor-pointer rounded-t-full"
                 onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                 style={{ display: visible ? 'block' : 'none' }}
            >
            TOP
            </div>


            {/* 刪除確認框 */}
            <Dialog open={openDialog} onClose={closeDialog}>
                <DialogTitle sx={{backgroundColor: '#f7e8e8'}}>{t('確定要刪除嗎？')}</DialogTitle>
                <DialogContent sx={{backgroundColor: '#f7e8e8'}}>
                <p>{t('刪除後，無法恢復')}</p>
                </DialogContent>
                <DialogActions  sx={{backgroundColor: '#f7e8e8'}}>
                <Button onClick={closeDialog} color="primary">
                    {t('取消')}
                </Button>
                <Button onClick={confirmDelete} color="error">
                    {t('確定')}
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Home;