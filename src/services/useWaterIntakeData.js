import { useState } from 'react'
import { useCookies } from 'react-cookie';
import api from './api';
import apiTelegram from './apiTelegram';
import Utils from '../hooks/utils';

const apiPrivate = (token) => {
  api.defaults.headers.Authorization = `Bearer ${token}`;
  return api
}

async function getWaterIntakeReport(token, data) {
  apiPrivate(token);
  const { initialDate, finalDate, amount, page, perPage } = data

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
  if (perPage > 0) {
    queryString += queryString.length > 0 ? '&' : '?'
    queryString += `per_page=${perPage}`
  }

  return await api.get('api/water-intakes' + queryString)
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

  return api.post('api/water-intake', { amount }).then(response => {
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
  const { getStartOfWeek, getEndOfWeek, getWeek, dateDiffInDays } = Utils()

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

    return getWaterIntakeReport(token, data)
  }

  const [waterIntakeData] = useState(handleGetWaterIntake())

  const handleRegisterWaterIntake = async (amount) => {
    const token = cookies.token

    await registerWaterIntake(amount, token).then(data => {
      handleGetWaterIntake(true)
      getWeeklyWaterIntakeChartData()
      getMonthlyWaterIntakeChartData()
    }).catch((error) => {
      console.log('Error', error.message);
    });
  }

  const handleDeleteWaterIntake = async (id) => {
    const token = cookies.token

    await deleteWaterIntake(id, token).then(data => {
      handleGetWaterIntake(true)
      getWeeklyWaterIntakeChartData()
      getMonthlyWaterIntakeChartData()
    }).catch((error) => {
      console.log('Error', error.message);
    });
  }

  const getWeeklyWaterIntakeChartData = async () => {
    const token = cookies.token
    const date = new Date();
    let initialDate = getStartOfWeek(date).toISOString().split('T')[0];
    let finalDate = getEndOfWeek(date).toISOString().split('T')[0];
    var amount = 0;
    var page = 0;
    var perPage = 10000;

    await getWaterIntakeReport(token, { initialDate, finalDate, amount, page, perPage }).then(response => {
      const waterIntakeChart = response.data.water_intake_chart
      if (waterIntakeChart.length === 1) {
        waterIntakeChart.push([new Date().toISOString().split('T')[0], 0, cookies.user.daily_water_amount])
      }
      setCookies('weekly_water_intake_chart', JSON.stringify(waterIntakeChart));
      return waterIntakeChart;
    }).catch((error) => {
      console.log(error.message)
    });
  }

  const getMonthlyWaterIntakeChartData = async () => {
    const token = cookies.token
    var date = new Date();
    var initialDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    var finalDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
    var amount = 0;
    var page = 0;
    var perPage = 10000;
    await getWaterIntakeReport(token, { initialDate, finalDate, amount, page, perPage }).then(response => {
      const waterIntakeChart = response.data.water_intake_chart
      const data = waterIntakeChart.reduce((acc, curr, index, original) => {
        if (index !== 0) {
          const [DD, MM, YYYY] = curr[0].split('/');
          const date = new Date(`${YYYY}-${MM}-${DD} 00:00:00`);
          const today = new Date();
          var initialDateMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          var finalDateMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          let initialDate = getStartOfWeek(date);
          let finalDate = getEndOfWeek(date);
          initialDate = (initialDate < initialDateMonth ? initialDateMonth : initialDate);
          finalDate = (finalDate > finalDateMonth ? finalDateMonth : finalDate);
          const diff = dateDiffInDays(initialDate, finalDate) + 1;
          const week = getWeek(date);
          if (!acc[week]) {
            acc[week] = {
              week: week,
              start: initialDate.toLocaleDateString('pt-BR'),
              end: finalDate.toLocaleDateString('pt-BR'),
              total: 0,
              wanted: curr[2] * diff
            };
          }
          acc[week].total += curr[1];
        }

        return acc;
      }, []);
      let fetchWaterIntakeData = [
        ['Semana', 'Total Consumido', 'Meta']
      ];
      data.map((item) => {
        fetchWaterIntakeData.push([
          `${item.start} - ${item.end}`,
          parseInt(item.total),
          parseInt(item.wanted)
        ]);

        return item
      });

      setCookies('monthly_water_intake_chart', JSON.stringify(fetchWaterIntakeData));
      return fetchWaterIntakeData;
    }).catch((error) => {
      console.log(error.message)
    });
  }

  return {
    getWaterIntakeData: handleGetWaterIntake,
    getWaterIntakeReport: handleGetWaterIntakeReport,
    setWaterIntakeData: handleRegisterWaterIntake,
    deleteWaterIntake: handleDeleteWaterIntake,
    getWeeklyWaterIntakeChartData: getWeeklyWaterIntakeChartData,
    getMonthlyWaterIntakeChartData: getMonthlyWaterIntakeChartData,
    waterIntakeData
  }
}

export default useWaterIntakeData