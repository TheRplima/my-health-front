import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth';

export const ProtectRoutes = () => {
    const { cookies, refreshUser, parseJwt, logout } = useAuth();
    const [token, setToken] = useState(null)
    const [refreshing, setRefreshing] = useState(false)
    const interval = useRef(null)

    useEffect(() => {
        const refreshToken = async () => {
            await refreshUser().then(() => {
                setRefreshing(false);
            }).catch((error) => {
                console.log(error.message);
            });
        }

        if (!refreshing) {
            interval.current = setInterval(() => {
                if (!token) {
                    setToken(cookies.token ?? null)
                }
                const keepLoggedIn = cookies.keepLoggedIn ?? false;

                if (token === null) {
                    clearInterval(interval.current);
                    interval.current = null;
                    return false;
                }

                const decodedJwt = parseJwt(token);
                if (new Date(decodedJwt.exp * 1000 - 30000) < Date.now() && keepLoggedIn === true) {
                    setRefreshing(true);
                    refreshToken();
                } else if (new Date(decodedJwt.exp * 1000 - 30000) < Date.now() && keepLoggedIn === false) {
                    setToken(null)
                    logout();
                }
            }, 1000)
        }
        return () => {
            clearInterval(interval.current);
            setRefreshing(false);
        };
    });

    return cookies.token ? <Outlet /> : <Navigate to='/login' exact />
};