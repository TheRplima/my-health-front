import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "Variação do peso corporal ao longo do ano",
  vAxis: { title: "peso" },
  hAxis: { title: "Dia" },
  seriesType: "line",
};

const WeightControlChart = ({ data, title, vAxisTitle, hAxisTitle }) => {
  options.title = title ? title : options.title;
  options.vAxis.title = vAxisTitle ? vAxisTitle : options.vAxis.title;
  options.hAxis.title = hAxisTitle ? hAxisTitle : options.hAxis.title;

  return (
    <Chart
      chartType="ComboChart"
      width="100%"
      data={data}
      options={options}
    />
  )
}

export default WeightControlChart