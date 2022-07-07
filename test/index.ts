import {
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    FountTypeEnum,
    Payment,
    TaxPercentageEnum,
    calculateInvoicePrices
} from '../src';

const payment: Payment = {
    amount: 10000,
    change: 222.4
};

const concepts: Concept[] = [
    {
        id: 1,
        name: 'AMORTIGUADOR DELANTERO FORD F250 F350 3.4 07-14 835190',
        price: 975,
        quantity: 2,
        charges: [
            {
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                amount: 5,
                type: ChargeTypeEnum.SURCHARGES,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                amount: 10,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
        ]
    },
    {
        id: 2,
        name: 'AMORTIGUADOR TRASERO FORD F150-F350 RANGER 97-07 835054',
        price: 904,
        quantity: 2,
        charges: [
            {
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                amount: 5,
                type: ChargeTypeEnum.SURCHARGES,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                amount: 10,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
        ]
    },
    {
        id: 3,
        name: 'REPSET FORD F250 F350 F 450 SUPER DUTY 5.4 99-14 630306000',
        price: 6890,
        quantity: 1,
        charges: [
            {
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                amount: 5,
                type: ChargeTypeEnum.SURCHARGES,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                amount: 10,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
        ]
    },
    {
        id: 4,
        name: 'ACEITE ROSHFRANS SAE 250 LT RST250LT',
        price: 108,
        quantity: 2,
        charges: [
            {
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                amount: 5,
                type: ChargeTypeEnum.SURCHARGES,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                amount: 10,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
        ]
    },
];


const traditional = calculateInvoicePrices({
    payment,
    concepts,
    fountType: FountTypeEnum.TRADITIONAL,
    ivaPercentage: TaxPercentageEnum.T16
});

console.log(`TRADICIONAL: ${JSON.stringify(traditional, null, 3)}`);

const discountOnDiscount = calculateInvoicePrices({
    payment,
    concepts,
    fountType: FountTypeEnum.DISCOUNT_ON_DISCOUNT,
    ivaPercentage: TaxPercentageEnum.T16
});

console.log(`DESCUENTO SOBRE DESCUENTO: ${JSON.stringify(discountOnDiscount, null, 3)}`);

