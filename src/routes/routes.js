import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '../pages/home';
import UpdateAccountPage from '../pages/updateAccountPage';
import CreateAccountPage from '../pages/createAccountPage';
import { deleteAccount } from '../utils/deleteAccounts';

const routes = (accounts, totalCost, setAccounts, setTotalCost, setRefresh) => [
    {
        path: '/',
        element: <Home 
                    accounts={accounts} 
                    totalCost={totalCost} 
                    deleteAccount={deleteAccount} 
                    setAccounts={setAccounts} 
                    setTotalCost={setTotalCost} 
                    setRefresh={setRefresh} 
                />
    },
    {
        path: '/accounts/*',
        children: [
            {
                path: 'create',
                element: <CreateAccountPage setRefresh={setRefresh} />
            },
            {
                path: ':id/update',
                element: <UpdateAccountPage setRefresh={setRefresh} />
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" replace />
    }
];

export default routes;