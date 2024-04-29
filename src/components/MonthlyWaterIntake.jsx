import React, { useEffect, useState } from 'react';
import useWaterIntakeData from '../services/useWaterIntakeData';
import WaterIntakeChart from './WaterIntakeChart';
import { useAuth } from "../hooks/auth";

export default function MonthlyWaterIntake() {
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
            var date = new Date();
            var initialDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
            var finalDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
            var amount = 0;
            var page = 0;
            var perPage = 10000;
            await getWaterIntakeReport({ initialDate, finalDate, amount, page, perPage }).then(response => {
                const waterIntakeChart = response.data.water_intake_chart
                const data = waterIntakeChart.reduce((acc, curr, index) => {
                    if (index !== 0) {
                        const [DD, MM, YYYY] = curr[0].split('/');
                        const date = new Date(`${YYYY}-${MM}-${DD}`);
                        var primeiro = date.getDate() - date.getDay();
                        let primeiroDia = new Date(date.setDate(primeiro)).toLocaleDateString('pt-BR');
                        let ultimoDia = new Date(date.setDate(date.getDate() + 6)).toLocaleDateString('pt-BR');
                        const week = date.getWeek();
                        if (!acc[week]) {
                            acc[week] = {
                                week: week,
                                start: primeiroDia,
                                end: ultimoDia,
                                total: 0,
                                wanted: curr[2] * 7
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

                setWaterIntakesChartData(fetchWaterIntakeData);
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
                    <WaterIntakeChart data={waterIntakesChartData} title={'Consumo de água no mês'} hAxisTitle={'Semana'} />
                ) : ('')
            }
        </>
    )
}