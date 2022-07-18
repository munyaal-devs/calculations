import {
    calculateInvoicePrices,
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    FountTypeEnum,
    Payment,
    TaxPercentageEnum,
} from '../src';

const payment: Payment = {
    amount: 882,
    change: 0.000000
};

const concepts: Concept[] = [
    {
        id: 1,
        quantity: 1,
        basePrice: 882,
        name: 'Bobina',
        charges: [],
    },
]

const {detailsWithPaymentApplied: traditional} = calculateInvoicePrices({
    payment,
    concepts,
    fountType: FountTypeEnum.DISCOUNT_ON_DISCOUNT,
    ivaPercentage: TaxPercentageEnum.T16
});

console.log(JSON.stringify(traditional, null, 3))

console.log(traditional.amount?.toFixed(2))
console.log(traditional.total?.toFixed(2))
console.log(traditional.tax?.toFixed(2))
