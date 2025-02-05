import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [totalValue, setTotalValue] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [chartData, setChartData] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSIP = () => {
    const months = investmentPeriod * 12;
    const monthlyRate = annualReturn / 12 / 100;

    const futureValue =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalInvested = monthlyInvestment * months;
    const returns = futureValue - totalInvested;

    setTotalValue(futureValue);
    setEstimatedReturns(returns);

    // Generate chart data
    const data = [];
    for (let year = 1; year <= investmentPeriod; year++) {
      const yearMonths = year * 12;
      const yearFV =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);
      data.push({
        year: year,
        value: yearFV,
      });
    }
    setChartData(data);
  };

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, annualReturn, investmentPeriod]);

  return (
    <div className="calculator-container">
      <h1>SIP Calculator</h1>

      <div className="input-group">
        <div className="input-container">
          <label>Monthly Investment (₹)</label>
          <input
            type="number"
            value={monthlyInvestment}
            onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
            min="500"
            step="500"
          />
        </div>

        <div className="input-container">
          <label>Expected Annual Return (%)</label>
          <input
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(Number(e.target.value))}
            min="1"
            max="30"
            step="0.5"
          />
        </div>

        <div className="input-container">
          <label>Investment Period (Years)</label>
          <input
            type="number"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
            min="1"
            max="40"
          />
        </div>
      </div>

      <div className="results">
        <div className="result-box">
          <h3>Total Invested</h3>
          <p>{formatCurrency(monthlyInvestment * investmentPeriod * 12)}</p>
        </div>
        <div className="result-box">
          <h3>Estimated Returns</h3>
          <p>{formatCurrency(estimatedReturns)}</p>
        </div>
        <div className="result-box accent">
          <h3>Total Value</h3>
          <p>{formatCurrency(totalValue)}</p>
        </div>
      </div>

      <div className="chart-container">
        <h2>Investment Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{
                value: "Years",
                position: "bottom",
              }}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
              label={{
                value: "Amount",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => `${label} Years`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ fill: "#8884d8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SIPCalculator;
