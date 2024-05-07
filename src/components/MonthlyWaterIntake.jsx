import React, { useEffect, useState } from 'react';
import useWaterIntakeData from '../services/useWaterIntakeData';
import WaterIntakeChart from './WaterIntakeChart';
import { useAuth } from "../hooks/auth";

export default function MonthlyWaterIntake() {
    const { cookies } = useAuth();
    const { getMonthlyWaterIntakeChartData } = useWaterIntakeData();
    const [waterIntakesChartData, setWaterIntakesChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadStorageData() {
            await getMonthlyWaterIntakeChartData().then(response => {
                setWaterIntakesChartData(response);
                setLoading(false);
            }).catch((error) => {
                console.log(error.message)
                setLoading(false);
            });
        }

        if (!loading) {
            setLoading(true);
            if (cookies.monthly_water_intake_chart) {
                setWaterIntakesChartData(cookies.monthly_water_intake_chart);
                setLoading(false);
            } else {
                loadStorageData();
            }
        }

        return () => {
            setWaterIntakesChartData({});
            setLoading(true)
        }
    }, [cookies.water_intakes, cookies.weekly_water_intake_chart, cookies.monthly_water_intake_chart]);

    return (<WaterIntakeChart chartId={'monthly'} data={waterIntakesChartData} title={'Consumo de água no mês'} hAxisTitle={'Semana'} />)
}