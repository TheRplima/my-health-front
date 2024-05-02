import React, { useEffect, useState } from 'react';
import useWaterIntakeData from '../services/useWaterIntakeData';
import WaterIntakeChart from './WaterIntakeChart';
import Utils from '../hooks/utils';

export default function MonthlyWaterIntake() {
    const { getStartOfWeek, getEndOfWeek, getWeek } = Utils();
    const { getWaterIntakeReport } = useWaterIntakeData();
    const [waterIntakesChartData, setWaterIntakesChartData] = useState({});

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
                        let initialDate = getStartOfWeek(date).toLocaleDateString('pt-BR');
                        let finalDate = getEndOfWeek(date).toLocaleDateString('pt-BR');
                        const week = getWeek(date);
                        if (!acc[week]) {
                            acc[week] = {
                                week: week,
                                start: initialDate,
                                end: finalDate,
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
                    <WaterIntakeChart key={'monthly'} data={waterIntakesChartData} title={'Consumo de água no mês'} hAxisTitle={'Semana'} />
                ) : ('')
            }
        </>
    )
}