import React, { useEffect, useState } from 'react';
import useWaterIntakeData from '../services/useWaterIntakeData';
import WaterIntakeChart from './WaterIntakeChart';
import Utils from '../hooks/utils';

export default function WeeklyWaterIntake() {
    const { getStartOfWeek, getEndOfWeek, getWeek } = Utils()
    const { getWaterIntakeReport } = useWaterIntakeData()
    const [waterIntakesChartData, setWaterIntakesChartData] = useState({});

    useEffect(() => {
        async function loadStorageData() {
            const date = new Date();
            let initialDate = getStartOfWeek(date).toISOString().split('T')[0];
            let finalDate = getEndOfWeek(date).toISOString().split('T')[0];
            var amount = 0;
            var page = 0;
            var perPage = 10000;
            await getWaterIntakeReport({ initialDate, finalDate, amount, page, perPage }).then(response => {
                const waterIntakeChart = response.data.water_intake_chart

                setWaterIntakesChartData(waterIntakeChart);
            }).catch((error) => {
                console.log(error.message)
            });
        }

        loadStorageData();

        return () => {
            setWaterIntakesChartData({});
        }
    }, []);

    return (
        <>
            {
                waterIntakesChartData.length > 1 ? (
                    <WaterIntakeChart key={'weekly'} data={waterIntakesChartData} title={'Consumo de água na semana'} hAxisTitle={'Dia'} />
                ) : ('')
            }
        </>
    )
}