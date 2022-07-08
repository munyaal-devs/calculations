import {
    Concept,
    FountTypeEnum,
    Payment,
    TaxPercentageEnum,
    calculateInvoicePrices, ChargeTypeEnum, ChargeApplicationEnum,
} from '../src';

const payment: Payment = {
    amount: 2000.00,
    change: 0.000000
};

const concepts: Concept[] = [
    {
        id: 104,
        quantity: 1,
        basePrice: 1200,
        name: 'Mensualidad - junio',
        charges: [

        ],
    },
    {
        id: 105,
        quantity: 1,
        basePrice: 1200,
        name: 'Mensualidad - julio',
        charges: [

        ],
    },
    {
        id: 106,
        quantity: 1,
        basePrice: 1500,
        name: 'Inscripción ',
        charges: [

        ],
    }
]

const {detailsWithPaymentApplied: traditional} = calculateInvoicePrices({
    payment,
    concepts,
    fountType: FountTypeEnum.TRADITIONAL,
    ivaPercentage: TaxPercentageEnum.T0
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
