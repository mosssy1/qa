class APIHandler {
    constructor(currencyConverter) {
        this.currencyConverter = currencyConverter;
    }

    async getCurrencyRate(currencyCode) {
        if (!(currencyCode in this.currencyConverter.currencyRates)) {
            throw "Currency not found";
        }

        return this.currencyConverter.currencyRates[currencyCode];
    }
}

module.exports = APIHandler;