import { calculateInvoicePrices } from '../src/calculations';
import {
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    FountTypeEnum,
    Payment,
    TaxPercentageEnum
} from '../src/types';

console.log('Información de entrada \n \n \n');

const payment: Payment = {
    amount: 10000,
    change: 5000
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

// console.log(`Conceptos: ${JSON.stringify(concepts, null, 3)}`);

const value = calculateInvoicePrices({
    payment,
    concepts,
    fountType: FountTypeEnum.TRADITIONAL,
    ivaPercentage: TaxPercentageEnum.T16
});
console.log('Información de salida \n \n \n');

console.log(JSON.stringify(value, null, 3))
