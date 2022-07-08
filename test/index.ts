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
    amount: 300,
    change: 0.000000
};

const concepts: Concept[] = [
    {
        id: 104,
        quantity: 1,
        basePrice: 720,
        name: 'Mensualidad - junio',
        charges: [
            {
                amount: 50,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE,
                order: 1,
            },
            {
                amount: 10,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE,
                order: 2,
            },
            {
                amount: 10,
                type: ChargeTypeEnum.SURCHARGES,
                application: ChargeApplicationEnum.PERCENTAGE,
                order: 3,
            }
        ],
    }
]

const {detailsWithPaymentApplied: traditional} = calculateInvoicePrices({
    payment,
    concepts,
    fountType: FountTypeEnum.DISCOUNT_ON_DISCOUNT,
    ivaPercentage: TaxPercentageEnum.T16
});

console.log(JSON.stringify(traditional, null, 3))
