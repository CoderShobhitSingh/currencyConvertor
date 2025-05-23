import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available currencies
    axios.get('https://api.exchangerate-api.com/v4/latest/USD')
      .then(response => {
        setCurrencies(Object.keys(response.data.rates));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch exchange rate
    if (fromCurrency && toCurrency) {
      setLoading(true);
      axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        .then(response => {
          setExchangeRate(response.data.rates[toCurrency]);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching exchange rate:', error);
          setLoading(false);
        });
    }
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = amount * (exchangeRate || 0);

  return (
    <div className="App">
      <div className="converter-container">
        <h1>Currency Converter</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="converter-form">
            <div className="input-group">
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min="0"
                step="0.01"
              />
              <select value={fromCurrency} onChange={handleFromCurrencyChange}>
                {currencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <button className="swap-button" onClick={handleSwapCurrencies}>
              ⇅ Swap
            </button>
            <div className="input-group">
              <input
                type="number"
                value={convertedAmount.toFixed(2)}
                readOnly
              />
              <select value={toCurrency} onChange={handleToCurrencyChange}>
                {currencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <div className="exchange-rate">
              <p>1 {fromCurrency} = {exchangeRate?.toFixed(4)} {toCurrency}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 