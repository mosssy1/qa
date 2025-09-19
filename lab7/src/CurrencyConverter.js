class CurrencyConverter {
    constructor(currencyRates) {
        this.currencyRates = currencyRates;
    }

    convertCurrency(fromCurrency, toCurrency, amount) {
        if (!(fromCurrency in this.currencyRates) || !(toCurrency in this.currencyRates)) {
            throw new Error("Currency not found");
        }

        const fromRate = this.currencyRates[fromCurrency];
        const toRate = this.currencyRates[toCurrency];
        const convertedAmount = amount * (toRate / fromRate);

        return convertedAmount;
    }
}

module.exports = CurrencyConverter;