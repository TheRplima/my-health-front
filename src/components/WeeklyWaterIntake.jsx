import React, { useEffect, useState } from 'react';
import useWaterIntakeData from '../services/useWaterIntakeData';
import WaterIntakeChart from './WaterIntakeChart';
import { useAuth } from "../hooks/auth";

export default function WeeklyWaterIntake() {
    const { cookies } = useAuth();
    const { getWaterIntakeReport } = useWaterIntakeData()
    const [waterIntakesChartData, setWaterIntakesChartData] = useState({});
    const [loading, setLoading] = useState(true);

    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
        var dayOfYear = ((today - onejan + 86400000) / 86400000);
        return Math.ceil(dayOfYear / 7)
    };

    useEffect(() => {
        async function loadStorageData() {
            const date = new Date();
            var primeiro = date.getDate() - date.getDay();
            let initialDate = new Date(date.setDate(primeiro)).toISOString().split('T')[0];
            let finalDate = new Date(date.setDate(date.getDate() + 6)).toISOString().split('T')[0];
            var amount = 0;
            var page = 0;
            var perPage = 10000;
            await getWaterIntakeReport({ initialDate, finalDate, amount, page, perPage }).then(response => {
                const waterIntakeChart = response.data.water_intake_chart

                setWaterIntakesChartData(waterIntakeChart);
                setLoading(false);
            }).catch((error) => {
                console.log(error.message)
            });
        }

        loadStorageData();

        return () => {
            setWaterIntakesChartData({});
            setLoading(true);
        }
    }, []);

    return (
        <>
            {
                waterIntakesChartData.length > 1 ? (
                    <WaterIntakeChart data={waterIntakesChartData} title={'Consumo de água na semana'} hAxisTitle={'Dia'} />
                ) : ('')
            }
        </>
    )
}