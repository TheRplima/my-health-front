import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth';

export const ProtectRoutes = () => {
    const { cookies, refreshUser } = useAuth();

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    return cookies.token ? <Outlet /> : <Navigate to='/login' exact />
};