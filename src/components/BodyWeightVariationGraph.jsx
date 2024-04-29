import React, { useEffect, useState } from 'react';
import useWeightControlData from '../services/useWeightControlData';
import WeightControlChart from './WeightControlChart';
import { useAuth } from "../hooks/auth";

export default function BodyWeightVariationGraph() {
    const { cookies } = useAuth();
    const { getWeightControlReport } = useWeightControlData()
    const [weightControlsChartData, setWeightControlsChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const ano = new Date().getFullYear();
            let initial_date = ano + '-01-01';
            let final_date = ano + '-12-31';
            let max = 0;
            let refresh = true;
            await getWeightControlReport(refresh, max, initial_date, final_date).then((response) => {
                const weightControlReportData = response.weight_control_list;
                let fetchWaterIntakeData = [
                    ['Dia', 'Peso Corporal']
                ];
                weightControlReportData.forEach((element) => {
                    fetchWaterIntakeData.push([new Date(element.created_at).toLocaleDateString('pt-BR'), element.weight])
                });
                setWeightControlsChartData(fetchWaterIntakeData)
            })
                .catch((error) => {
                    console.log(error.message)
                });
        }

        loadStorageData();

        return () => {
            setWeightControlsChartData({});
            setLoading(true);
        }
    }, []);

    return (
        <>
            {
                weightControlsChartData.length > 1 ? (
                    <WeightControlChart data={weightControlsChartData} title={'Variação do peso corporal ao longo do ano'} hAxisTitle={'Dia'} />
                ) : ('')
            }
        </>
    )
}