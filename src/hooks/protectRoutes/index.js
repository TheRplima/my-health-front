import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../auth';

export const ProtectRoutes = () => {
    const { cookies, refreshUser, parseJwt, logout } = useAuth();
    const [tries, setTries] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const interval = useRef(null)
    const expTimeDelay = 1 * 60 * 1000;

    useEffect(() => {
        const refreshToken = async () => {
            clearInterval(interval.current);
            interval.current = null;
            await refreshUser().then(() => {
                setRefreshing(false);
                initInterval();
                console.log('Token refreshed');
                setTries(0);
            }).catch((error) => {
                console.log(error.message);
                setRefreshing(false);
                setTries(tries + 1);
            });
        }

        const initInterval = () => {
            interval.current = setInterval(() => {
                const token = cookies.token;
                const keepLoggedIn = cookies.keepLoggedIn;

                if (token === null) {
                    clearInterval(interval.current);
                    interval.current = null;
                    return false;
                }

                const decodedJwt = parseJwt(token);

                if (new Date(decodedJwt.exp * 1000 - expTimeDelay) < Date.now() && keepLoggedIn === true && tries < 3) {
                    setRefreshing(true);
                    refreshToken();
                } else if (new Date(decodedJwt.exp * 1000 - expTimeDelay) < Date.now() && (keepLoggedIn === false || tries > 2)) {
                    logout();
                    clearInterval(interval.current);
                    interval.current = null;
                    console.log('Token expired');
                }
            }, 10000)
        }
        if (!refreshing) {
            initInterval();
        }
        return () => {
            clearInterval(interval.current);
        };
    });

    return cookies.token ? <Outlet /> : <Navigate to='/login' exact />
};