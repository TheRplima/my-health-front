import { createContext, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookie] = useCookies();

    const apiPrivate = () => {
        const token = cookies?.token ?? null;
        api.defaults.headers.Authorization = `Bearer ${token}`;
        return api
    }

    const login = async ({ email, password, keepLoggedIn }) => {
        api.post('api/login', {
            email: email,
            password: password
        }).then(response => {
            if (checkToken(response.data.authorisation.token) === false) {
                alert('Token expirado, faça login novamente');
                logout();
                return;
            }

            setCookies('token', response.data.authorisation.token, { secure: false });
            setCookies('user', JSON.stringify(response.data.user), { secure: false });
            setCookies('keepLoggedIn', keepLoggedIn, { secure: false });

            //if on mobile use window.location
            navigate(process.env.REACT_APP_HOME_PAGE);

        }).catch(error => {
            console.log(error);
            alert('Erro ao realizar login: ' + error.response.data.message);
        });
    };

    const logout = async (force = false) => {
        apiPrivate();
        const cookiesToRemove = ['water_intakes', 'weight_controls', 'water_intake_containers', 'monthly_water_intake_chart', 'weekly_water_intake_chart', 'weight_control_variation_chart'];
        if (cookies.keepLoggedIn === false || force === true) {
            cookiesToRemove.push('token', 'token_exp', 'user');
        }
        cookiesToRemove.forEach(cookie => {
            removeCookie(cookie);
        });
        await api.post('api/logout').then(response => {
            navigate('/login');
        }).catch(error => {
            console.log('Error', error.message);
            navigate('/login');
        });

    };

    const refreshUser = async () => {
        apiPrivate();
        return await api.post('api/refresh').then(response => {
            if (checkToken(response.data.authorisation.token) === false) {
                alert('Token expirado, faça login novamente');
                logout();
                return;
            }
            setCookies('token', response.data.authorisation.token, { secure: false });
            setCookies('user', JSON.stringify(response.data.user), { secure: false });
        }).catch(error => {
            console.log('Error', error.message);
        });
    }

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return null;
        }
    };

    const checkToken = (token) => {
        const decodedJwt = parseJwt(token);
        if (decodedJwt.exp * 1000 < Date.now()) {
            return false;
        }
        if (!cookies.token_exp) {
            setCookies('token_exp', decodedJwt.exp * 1000, { secure: false });
        }
        return true;
    }

    const value = useMemo(
        () => ({
            cookies,
            setCookies,
            login,
            logout,
            refreshUser,
            checkToken,
            parseJwt
        }),
        [cookies]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(UserContext)
};