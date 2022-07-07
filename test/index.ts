import {
    Concept,
    FountTypeEnum,
    Payment,
    TaxPercentageEnum,
    calculateInvoicePrices, ChargeTypeEnum, ChargeApplicationEnum
} from '../src';

const payment: Payment = {
    amount: 3705.00,
    change: 0.000000
};

const concepts: Concept[] = [
    {
        id: 104,
        quantity: 1,
        basePrice: 1200,
        name: 'Mensualidad - junio',
        charges: [
            {
                id: 1,
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                id: 2,
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                id: 3,
                amount: 5,
                type: ChargeTypeEnum.SURCHARGES,
                application: ChargeApplicationEnum.PERCENTAGE
            },
        ],
    },
    {
        id: 105,
        quantity: 1,
        basePrice: 1200,
        name: 'Mensualidad - julio',
        charges: [
            {
                id: 1,
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                id: 2,
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                id: 3,
                amount: 5,
                type: ChargeTypeEnum.SURCHARGES,
                application: ChargeApplicationEnum.PERCENTAGE
            },
        ],
    },
    {
        id: 106,
        quantity: 1,
        basePrice: 1500,
        name: 'Inscripción ',
        charges: [
            {
                id: 1,
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                id: 2,
                amount: 5,
                type: ChargeTypeEnum.DISCOUNTS,
                application: ChargeApplicationEnum.PERCENTAGE
            },
            {
                id: 3,
                amount: 5,
                type: ChargeTypeEnum.SURCHARGES,
                application: ChargeApplicationEnum.PERCENTAGE
            },
        ],
    }
]

const traditional = calculateInvoicePrices({
    payment,
    concepts,
    fountType: FountTypeEnum.TRADITIONAL,
    ivaPercentage: TaxPercentageEnum.T16
});

console.log(JSON.stringify(traditional, null, 3))

//
// console.log(`RESULTADOS: ================ \n`);
//
// console.log(`CONCEPTOS: ================ \n`);
//
// traditional.concepts.forEach((value) => {
//     console.log('Producto / Servicio: ', value.name);
//     console.log('Precio unitario:     ', value.unitPrice?.toFixed(2));
//     console.log('Cantidad:            ', value.quantity.toFixed(6));
//     console.log('Precio con IVA:      ', value.priceWithIva?.toFixed(2));
//     console.log('Precio sin IVA:      ', value.priceWithoutIva?.toFixed(2));
//     console.log('Descuentos con IVA:  ', value.discountsWithIva?.toFixed(2));
//     console.log('Descuentos sin IVA:  ', value.discountsWithoutIva?.toFixed(2));
//     console.log('Base de impuestos:   ', value.taxBase?.toFixed(2));
//     console.log('Impuestos:           ', value.tax?.toFixed(2));
//     console.log('Total:               ', value.total?.toFixed(2));
//
//     console.log('\n');
// })
//
// console.log(`DETALLES DE VENTA: ================ \n`);
//
// console.log('Precio con IVA:      ', traditional.priceWithIva.toFixed(2));
// console.log('Precio sin IVA:      ', traditional.priceWithoutIva.toFixed(2));
// console.log('Descuentos con IVA:  ', traditional.discountsWithIva.toFixed(2));
// console.log('Descuentos sin IVA:  ', traditional.discountsWithoutIva.toFixed(2));
// console.log('Base de impuestos:   ', traditional.totalTaxBase.toFixed(2));
// console.log('Impuestos:           ', traditional.totalTax.toFixed(2));
// console.log('Total:               ', traditional.total.toFixed(2));
