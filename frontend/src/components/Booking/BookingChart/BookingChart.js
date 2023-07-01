import React from "react";
// import { Bar as BarChart } from "react-charts";
// var BarChart = require("react-chartjs").Bar;
const bookings_bucket = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 1000000,
  },
};
const bookingChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in bookings_bucket) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > bookings_bucket[bucket].min &&
        current.event.price <= bookings_bucket[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0); //reduce function: first argument will be a function and second is starting value
    // output[bucket] = filteredBookingsCount;
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      //   label: "My First dataset",
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(220,220,220,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0; //reseting values to 0
  }

  return (
    <div style={{ textAlign: "center" }}>
      {" "}
      {/* <BarChart data={chartData} /> */}
    </div>
  );
};

export default bookingChart;
