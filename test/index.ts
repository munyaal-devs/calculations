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

console.log(`RESULTADOS: ================ \n`);

console.log(`CONCEPTOS: ================ \n`);

traditional.concepts.forEach((value) => {
    console.log('Producto / Servicio: ', value.name);
    console.log('Cantidad:            ', value.quantity.toFixed(6));
    console.log('Precio unitario:     ', value.fiscalPrices?.unitPrice?.toFixed(3));
    console.log('Importe:             ', value.fiscalPrices?.amount?.toFixed(3));
    console.log('Descuento:           ', value.fiscalPrices?.discount?.toFixed(3));
    console.log('Base de impuestos:   ', value.fiscalPrices?.baseTax?.toFixed(3));
    console.log('Impuestos:           ', value.fiscalPrices?.tax?.toFixed(3));
    console.log('Total:               ', value.fiscalPrices?.total?.toFixed(3));
    console.log('\n');
})

console.log(`DETALLES DE VENTA: ================ \n`);

console.log('Importe:             ', traditional.amount?.toFixed(2));
console.log('Descuento:           ', traditional.discount?.toFixed(2));
console.log('Base de impuestos:   ', traditional.baseTax?.toFixed(2));
console.log('Impuestos:           ', traditional.tax?.toFixed(2));
console.log('Total:               ', traditional.total?.toFixed(2));
