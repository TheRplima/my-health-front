import { useState } from 'react'
import { useCookies } from 'react-cookie';
import api from './api';
import apiTelegram from './apiTelegram';

const apiPrivate = (token) => {
  api.defaults.headers.Authorization = `Bearer ${token}`;
  return api
}

async function getWaterIntakeReport(token, data) {
  apiPrivate(token);
  const { initialDate, finalDate, amount, page, per_page } = data

  let queryString = '';
  if (initialDate !== null) {
    queryString += `?initial_date=${initialDate}`
  }
  if (finalDate !== null) {
    queryString += queryString.length > 0 ? '&' : '?'
    queryString += `final_date=${finalDate}`
  }
  if (amount > 0) {
    queryString += queryString.length > 0 ? '&' : '?'
    queryString += `amount=${amount}`
  }
  if (page > 0) {
    queryString += queryString.length > 0 ? '&' : '?'
    queryString += `page=${page}`
  }
  if (per_page > 0) {
    queryString += queryString.length > 0 ? '&' : '?'
    queryString += `per_page=${per_page}`
  }

  return await api.get('api/water-intakes'+queryString)
}

async function getWaterIntake(token) {
  apiPrivate(token);

  return api.get('api/water-intake/get-water-intake-by-day').then(response => {
    return response.data
  }).catch(error => {
    console.log('Error', error.message);
  });
}

async function registerWaterIntake(amount, token) {
  apiPrivate(token);

  return api.post('api/water-intake',{amount}).then(response => {
     apiTelegram.post('sendMessage', {
      chat_id: process.env.REACT_APP_API_TELEGRAM_CHAT_ID,
      text: `/drinkWater ${amount}`
    }).catch(error => {
      console.log('Error', error.message);
    });
    return response.data
  }).catch(error => {
    console.log('Error', error.message);
  });
}

async function deleteWaterIntake(id, token) {
  apiPrivate(token);

  return api.delete(`api/water-intake/${id}`).then(response => {
    return response.data
  }).catch(error => {
    console.log('Error', error.message);
  });
}

const useWaterIntakeData = () => {
  const [cookies, setCookies] = useCookies();

  const handleGetWaterIntake = async (refresh = false) => {

    if (cookies.water_intakes && refresh === false) {
      return cookies.water_intakes
    }

    const token = cookies.token

    getWaterIntake(token).then(data => {
      const water_intakes = {
        list: data.water_intake_list,
        total_amount: data.total_amount
      }
      setCookies('water_intakes', JSON.stringify(water_intakes));

      return water_intakes
    }).catch((error) => {
      console.log('Error', error.message);
    });

    return {}

  }

  const handleGetWaterIntakeReport = (data) => {
    const token = cookies.token

    return getWaterIntakeReport(token,data)
  }

  const [waterIntakeData] = useState(handleGetWaterIntake())

  const handleRegisterWaterIntake = async (amount) => {
    const token = cookies.token

    registerWaterIntake(amount, token).then(data => {
      handleGetWaterIntake(true)
    }).catch((error) => {
      console.log('Error', error.message);
    });
  }

  const handleDeleteWaterIntake = async (id) => {
    const token = cookies.token

    deleteWaterIntake(id, token).then(data => {
      handleGetWaterIntake(true)
    }).catch((error) => {
      console.log('Error', error.message);
    });
  }

  return {
    getWaterIntakeData: handleGetWaterIntake,
    getWaterIntakeReport: handleGetWaterIntakeReport,
    setWaterIntakeData: handleRegisterWaterIntake,
    deleteWaterIntake: handleDeleteWaterIntake,
    waterIntakeData
  }
}

export default useWaterIntakeData