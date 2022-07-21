import {
    calculateInvoicePrices,
    Concept,
    FountTypeEnum,
    Payment,
    TaxPercentageEnum,
} from '../src';

const payment: Payment = {
    amount: 2790.00,
    change: 0.000000
};

const concepts: Concept[] = [
    {
        id: 1,
        quantity: 1,
        basePrice: 1675,
        name: 'Bobina',
        charges: [],
    },
    {
        id: 1,
        quantity: 1,
        basePrice: 465,
        name: 'Bobina',
        charges: [],
    },
    {
        id: 1,
        quantity: 1,
        basePrice: 360,
        name: 'Bobina',
        charges: [],
    },
    {
        id: 1,
        quantity: 1,
        basePrice: 165,
        name: 'Bobina',
        charges: [],
    },
    {
        id: 1,
        quantity: 1,
        basePrice: 125,
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


traditional.concepts.forEach((value) => {
    console.log(`Producto - ${value.name}`);

    console.log(`Cantidad               $ `, value?.quantity?.toFixed(3))


    console.log(`Precio unitario        $ `, value?.fiscalPrices?.unitPrice?.toFixed(3))
    console.log(`Importe                $ `, value?.fiscalPrices?.amount?.toFixed(3))
    console.log(`Descuento              $ `, value?.fiscalPrices?.discount?.toFixed(3))

    console.log(`Base de impuestos      $ `, value?.fiscalPrices?.baseTax?.toFixed(3))
    console.log(`Impuesto               $ `, value?.fiscalPrices?.tax?.toFixed(3))

    console.log('\n')
})

console.log('Impuestos \n \n')

console.log(`Base de impuestos      $ `, traditional.baseTax?.toFixed(3))
console.log(`Impuesto               $ `, traditional.tax?.toFixed(3))

console.log('Comprobante \n \n')
console.log(`Importe                $ `, traditional.amount?.toFixed(2))
console.log(`Descuento              $ `, traditional.discount?.toFixed(2))
console.log(`Impuesto               $ `, traditional.tax?.toFixed(2))
console.log(`Total                  $ `, traditional.total?.toFixed(2))
