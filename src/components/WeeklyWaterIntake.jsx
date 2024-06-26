import React, { useEffect, useState } from 'react';
import useWaterIntakeData from '../services/useWaterIntakeData';
import WaterIntakeChart from './WaterIntakeChart';
import { useAuth } from "../hooks/auth";

export default function WeeklyWaterIntake() {
    const { cookies } = useAuth();
    const { getWeeklyWaterIntakeChartData } = useWaterIntakeData()
    const [waterIntakesChartData, setWaterIntakesChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadStorageData() {
            await getWeeklyWaterIntakeChartData().then(response => {
                setWaterIntakesChartData(response);
                setLoading(false);
            }).catch((error) => {
                console.log(error.message)
                setLoading(false);
            });
        }

        if (!loading) {
            setLoading(true);
            if (cookies.weekly_water_intake_chart) {
                const wwic = cookies.weekly_water_intake_chart;
                if (wwic.length === 1) {
                    wwic.push([new Date().toISOString().split('T')[0], 0, cookies.user.daily_water_amount])
                }
                setWaterIntakesChartData(cookies.weekly_water_intake_chart);
                setLoading(false);
            } else {
                loadStorageData();
            }
        }

        return () => {
            setWaterIntakesChartData([]);
            setLoading(true);
        }
    }, [cookies.water_intakes, cookies.weekly_water_intake_chart]);

    return (<WaterIntakeChart chartId={'weekly'} data={waterIntakesChartData} title={'Consumo de água na semana'} hAxisTitle={'Dia'} />)
}