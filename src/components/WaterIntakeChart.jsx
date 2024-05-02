import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "Consumo de água no período",
  vAxis: { title: "Qtde (ml)" },
  hAxis: { title: "Dia" },
  seriesType: "bars",
  series: { 1: { type: "line" } },
};

const WaterIntakeChart = ({ data, title, vAxisTitle, hAxisTitle }) => {
  console.log(title)
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

export default WaterIntakeChart