const CurrencyConverter = require('../src/currencyConverter');
const APIHandler = require('../src/apiHandler');

describe('CurrencyConverter', () => {
    let currencyConverter;

    beforeEach(() => {
        const currencyRates = {
            "USD": 70.5,
            "EUR": 80.2,
            "GBP": 90.8
        };
        currencyConverter = new CurrencyConverter(currencyRates);
    });

    test('convertCurrency', () => {
        const fromCurrency = "USD";
        const toCurrency = "EUR";
        const amount = 100;

        const convertedAmount = currencyConverter.convertCurrency(fromCurrency, toCurrency, amount);

        expect(convertedAmount).toBeCloseTo(100 * (80.2 / 70.5), 2);
    });

    test('convertCurrency with missing currency', () => {
        const fromCurrency = "USD";
        const toCurrency = "CAD";

        expect(() => {
            currencyConverter.convertCurrency(fromCurrency, toCurrency, 100);
        }).toThrow('Currency not found');
    });
});

describe('APIHandler', () => {
    let apiHandler;

    beforeEach(() => {
        const currencyRates = {
            "USD": 70.5,
            "EUR": 80.2,
            "GBP": 90.8,
            "JPY": 0.64,
            "AUD": 50.6,
            "CAD": 55.3,
            "CHF": 72.9,
            "CNY": 10.2,
            "INR": 1.0,
            "RUB": 1.0,
            "KRW": 0.062,
            "BRL": 13.4
        };
        const converterMock = {
            currencyRates: currencyRates
        };
        apiHandler = new APIHandler(converterMock);
    });

    test('getCurrencyRate', async () => {
        const currencyCode = "USD";

        const result = await apiHandler.getCurrencyRate(currencyCode);

        expect(result).toBe(70.5);
    });

    test('getCurrencyRate with missing currency', async () => {
        const currencyCode = "DAC";

        try {
            await apiHandler.getCurrencyRate(currencyCode);
            fail("Expected error to be thrown, but it didn't.");
        } catch (error) {
            expect(error).toBe("Currency not found");
        }
    });
});