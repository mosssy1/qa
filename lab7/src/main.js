const express = require('express');
const CurrencyConverter = require('./currencyConverter');
const APIHandler = require('./apiHandler');
const currencyRates = require('./consts');

const app = express();

const currencyConverter = new CurrencyConverter(currencyRates);
const apiHandler = new APIHandler(currencyConverter);

app.get('/currencies', (req, res) => {
    res.json(currencyRates);
});

app.get('/convert', async (req, res) => {
    const fromCurrency = req.query.from;
    const toCurrency = req.query.to;
    const amount = parseFloat(req.query.amount) || 1.0;

    try {
        const currencyRate = await apiHandler.getCurrencyRate(fromCurrency);

        const convertedAmount = currencyConverter.convertCurrency(fromCurrency, toCurrency, amount);

        res.json({
            from: fromCurrency,
            to: toCurrency,
            amount: amount,
            converted_amount: convertedAmount
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});