import { useState } from 'react'
import { useCookies } from 'react-cookie';
import api from './api';
import useUserProfileData from './useUserProfileData';

const apiPrivate = (token) => {
  api.defaults.headers.Authorization = `Bearer ${token}`;
  return api
}

async function getWeightControl(token, max = 0, initial_date = null, final_date = null) {
  let queryString = '';
  if (initial_date !== null) {
    queryString += `?initial_date=${initial_date}`
  }
  if (final_date !== null) {
    queryString += queryString.length > 0 ? '&' : '?'
    queryString += `final_date=${final_date}`
  }
  if (max > 0) {
    queryString += queryString.length > 0 ? '&' : '?'
    queryString += `max=${max}`
  }
  apiPrivate(token);
  return api.get('api/weight-control' + queryString).then(response => {
    return response.data
  }).catch(error => {
    console.log('Error', error.message);
  });
}

async function registerWeightControl(date, weight, token) {
  apiPrivate(token);

  return api.post('api/weight-control', { date, weight }).then(response => {
    return response.data
  }).catch(error => {
    console.log('Error', error.message);
  });
}

async function deleteWeightControl(id, token) {
  apiPrivate(token);

  return api.delete(`api/weight-control/${id}`).then(response => {
    return response.data
  }).catch(error => {
    console.log('Error', error.message);
  });
}

const useWeightControlData = (max = 0, initial_date = null, final_date = null) => {
  const [cookies, setCookies] = useCookies();
  const { getUserProfileData } = useUserProfileData()
  const [weightControlData] = useState([])

  const handleGetWeightControl = async (payload) => {
    const { max, initial_date, final_date, refresh } = payload;

    if (cookies.weight_controls && refresh === false) {
      return cookies.weight_controls
    }

    const token = cookies.token

    getWeightControl(token, max, initial_date, final_date).then(data => {

      setCookies('weight_controls', JSON.stringify(data.weight_control_list));

      return data.weight_control_list
    }).catch((error) => {
      console.log('Error', error.message);
    });

    return []

  }

  const handleGetWeightControlReport = (payload) => {
    const { max, initial_date, final_date } = payload;
    const token = cookies.token

    return getWeightControl(token, max, initial_date, final_date)
  }



  const handleRegisterWeightControl = async (date, weight) => {
    const token = cookies.token

    registerWeightControl(date, weight, token).then(data => {
      const payload = {
        max: max,
        initial_date: initial_date,
        final_date: final_date,
        refresh: true
      }
      handleGetWeightControl(payload)
      getUserProfileData(true);
      getBobyWeightVariationChartData();
    }).catch((error) => {
      console.log('Error', error.message);
    });
  }

  const handleDeleteWeightControl = async (id) => {
    const token = cookies.token

    deleteWeightControl(id, token).then(data => {
      const payload = {
        max: max,
        initial_date: initial_date,
        final_date: final_date,
        refresh: true
      }
      handleGetWeightControl(payload)
      getUserProfileData(true);
      getBobyWeightVariationChartData();
    }).catch((error) => {
      console.log('Error', error.message);
    });
  }

  const getBobyWeightVariationChartData = async () => {
    const ano = new Date().getFullYear();
    let initial_date = ano + '-01-01';
    let final_date = ano + '-12-31';
    let max = 0;
    let refresh = true;
    await handleGetWeightControlReport(refresh, max, initial_date, final_date).then((response) => {
      const weightControlReportData = response.weight_control_list;
      let fetchWeightControlVariationData = [
        ['Dia', 'Peso Corporal']
      ];
      weightControlReportData.forEach((element) => {
        fetchWeightControlVariationData.push([new Date(element.created_at).toLocaleDateString('pt-BR'), element.weight])
      });
      setCookies('weight_control_variation_chart', JSON.stringify(fetchWeightControlVariationData));
      return fetchWeightControlVariationData;
    })
      .catch((error) => {
        console.log(error.message)
      });
  }

  return {
    getWeightControlData: handleGetWeightControl,
    getWeightControlReport: handleGetWeightControlReport,
    setWeightControlData: handleRegisterWeightControl,
    deleteWeightControl: handleDeleteWeightControl,
    getBobyWeightVariationChartData: getBobyWeightVariationChartData,
    weightControlData
  }
}

export default useWeightControlData