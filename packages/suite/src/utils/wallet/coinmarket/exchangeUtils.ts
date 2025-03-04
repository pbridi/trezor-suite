import { ExchangeInfo } from 'src/actions/wallet/coinmarketExchangeActions';
import { CryptoAmountLimits } from 'src/types/wallet/coinmarketCommonTypes';
import { ExchangeTrade, ExchangeTradeStatus } from 'invity-api';

// loop through quotes and if all quotes are either with error below minimum or over maximum, return error message
export const getAmountLimits = (quotes: ExchangeTrade[]): CryptoAmountLimits | undefined => {
    let min: number | undefined;
    let max: number | undefined;
    let currency = '';

    for (const quote of quotes) {
        let noError = true;
        const amount = Number(quote.sendStringAmount);
        if (quote.min && amount < quote.min) {
            min = Math.min(min || 1e28, quote.min);
            noError = false;
        }
        if (quote.max && quote.max !== 'NONE' && amount > quote.max) {
            max = Math.max(max || 0, quote.max);
            noError = false;
        }
        // if at least one quote succeeded do not return any message
        if (!quote.error && noError) {
            return;
        }
        if (!currency && quote.send) {
            currency = quote.send;
        }
    }
    if (min || max) {
        return { currency, minCrypto: min, maxCrypto: max };
    }
};

export const isQuoteError = (quote: ExchangeTrade): boolean => {
    if (
        quote.error ||
        !quote.receive ||
        !quote.receiveStringAmount ||
        !quote.sendStringAmount ||
        !quote.send
    ) {
        return true;
    }
    if (quote.min && Number(quote.sendStringAmount) < quote.min) {
        return true;
    }
    if (quote.max && quote.max !== 'NONE' && Number(quote.sendStringAmount) > quote.max) {
        return true;
    }

    return false;
};

// return 3 arrays: quotes not in error, quotes with min/max error, quotes with general error
const splitQuotes = (
    quotes: ExchangeTrade[],
): [ExchangeTrade[], ExchangeTrade[], ExchangeTrade[]] => [
    quotes.filter(q => !isQuoteError(q)),
    quotes.filter(q => isQuoteError(q) && !q.error),
    quotes.filter(q => q.error),
];

export const splitToQuoteCategories = (
    quotes: ExchangeTrade[],
    exchangeInfo: ExchangeInfo | undefined,
): [ExchangeTrade[], ExchangeTrade[], ExchangeTrade[]] => {
    const [fixedOK, fixedMinMax, fixedError] = splitQuotes(
        quotes.filter(
            q => exchangeInfo?.providerInfos[q.exchange || '']?.isFixedRate && !q.isDex,
        ) || [],
    );
    const [floatOK, floatMinMax, floatError] = splitQuotes(
        quotes.filter(
            q => !exchangeInfo?.providerInfos[q.exchange || '']?.isFixedRate && !q.isDex,
        ) || [],
    );
    const [dexOK, dexMinMax, dexError] = splitQuotes(quotes.filter(q => q.isDex) || []);

    const okLength = fixedOK.length + floatOK.length + dexOK.length;
    // if there are some OK quotes, do not show errors
    const fixedQuotes =
        // eslint-disable-next-line no-nested-ternary
        fixedOK.length > 0
            ? fixedOK.concat(fixedMinMax)
            : okLength > 0
              ? []
              : fixedMinMax.concat(fixedError);
    const floatQuotes =
        // eslint-disable-next-line no-nested-ternary
        floatOK.length > 0
            ? floatOK.concat(floatMinMax)
            : okLength > 0
              ? []
              : floatMinMax.concat(floatError);
    const dexQuotes =
        // eslint-disable-next-line no-nested-ternary
        dexOK.length > 0 ? dexOK.concat(dexMinMax) : okLength > 0 ? [] : dexMinMax.concat(dexError);

    return [fixedQuotes, floatQuotes, dexQuotes];
};

export const getStatusMessage = (status: ExchangeTradeStatus) => {
    switch (status) {
        case 'ERROR':
            return 'TR_EXCHANGE_STATUS_ERROR';
        case 'SUCCESS':
            return 'TR_EXCHANGE_STATUS_SUCCESS';
        case 'KYC':
            return 'TR_EXCHANGE_STATUS_KYC';
        case 'CONVERTING':
            return 'TR_EXCHANGE_STATUS_CONVERTING';
        default:
            return 'TR_EXCHANGE_STATUS_CONFIRMING';
    }
};
