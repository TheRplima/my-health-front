import React from "react";
import { Chart } from "react-google-charts";
import Spinner from 'react-bootstrap/Spinner';
import { Card } from "react-bootstrap";

const WaterIntakeChart = ({ data, title, vAxisTitle, hAxisTitle, chartId }) => {

  const options = {
    title: title ? title : "Consumo de água no período",
    vAxis: { title: vAxisTitle ? vAxisTitle : "Qtde (ml)" },
    hAxis: { title: hAxisTitle ? hAxisTitle : "Dia" },
    graph_id: chartId ? chartId : "WaterIntakeChart",
    seriesType: "bars",
    series: { 1: { type: "line" } },
    pointSize: 10,
    animation: {
      duration: 1500,
      easing: "InAndOut",
      startup: true,
    }
  };

  return (
    <>
      {data !== undefined && data.length > 0 ? (
        <Card>
          <Card.Body>
            <div id={'chart_' + chartId} className={'d-flex align-items-center justify-content-center text-center'}>
              <Chart
                chartType="ComboChart"
                rootProps={{ "data-testid": chartId }}
                width={"100%"}
                height={"100%"}
                loader={
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                }
                data={data}
                options={options}
              />
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-3 h-100">
          <Card.Body>
            <table className='table table-striped table-hover'>
              <tr>
                <td colSpan="3" className='text-center'>
                  <Card.Text>Nenhum registro encontrado</Card.Text>
                </td>
              </tr>
            </table>
          </Card.Body>
        </Card>
      )}
    </>
  )
}

export default WaterIntakeChart