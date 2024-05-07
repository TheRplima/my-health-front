import React, { useEffect, useState } from 'react';
import useWeightControlData from '../services/useWeightControlData';
import WeightControlChart from './WeightControlChart';
import { useAuth } from "../hooks/auth";

export default function BodyWeightVariationGraph() {
    const { cookies } = useAuth();
    const { getBobyWeightVariationChartData } = useWeightControlData()
    const [weightControlsChartData, setWeightControlsChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadStorageData() {
            await getBobyWeightVariationChartData().then((response) => {
                setWeightControlsChartData(response);
                setLoading(false);
            }).catch((error) => {
                console.log(error.message)
                setLoading(false);
            });
        }

        if (!loading) {
            setLoading(true);
            if (cookies.weight_control_variation_chart) {
                setWeightControlsChartData(cookies.weight_control_variation_chart);
                setLoading(false);
            } else {
                loadStorageData();
            }
        }

        return () => {
            setWeightControlsChartData([]);
            setLoading(false);
        }
    }, [cookies.weight_control_variation_chart, cookies.weight_controls]);

    return (<WeightControlChart chartId={'weight-contnrol-variation'} data={weightControlsChartData} title={'Variação do peso corporal ao longo do ano'} hAxisTitle={'Dia'} />)
}