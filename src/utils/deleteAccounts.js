import axios from 'axios';

export const deleteAccount = async (accountId, setAccounts, setTotalCost, accounts, setRefresh) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  try {
    //console.log('deleteID: ', accountId);
    //await axios.post(`http://localhost:5001/accounts/${accountId}/delete`);
    await axios.post(`${apiUrl}/accounts/${accountId}/delete`);

    // filter過濾函數遍歷 accounts 陣列，並保留 id 不等於 accountId 的項目。也就是符合 accountId 的那個項目會被移除
    setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== accountId));

    //當某消費被刪除時，從總消費中扣除某消費
    setTotalCost(prevTotal => prevTotal - accounts.find(account => account.id === accountId).cost);
    
    setRefresh(refresh_Num => refresh_Num + 1);
    
  } catch (error) {
    console.error('error!delete!', error);
  }
};