import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "Consumo de água no período",
  vAxis: { title: "Qtde (ml)" },
  hAxis: { title: "Dia" },
  seriesType: "bars",
  series: { 1: { type: "line" } },
};

const WaterIntakeChart = ({ data }) => {

  return (
    <Chart
      chartType="ComboChart"
      width="100%"
      height="450px"
      data={data}
      options={options}
    />
  )
}

export default WaterIntakeChart