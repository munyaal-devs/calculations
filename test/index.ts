import {
    calculateInvoicePrices,
    Charge,
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    FountTypeEnum,
    Payment,
    TaxPercentageEnum,
} from '../src';

const payment: Payment = {
    amount: 916,
    change: 0
};

const charge: Charge = {
    amount: 33,
    type: ChargeTypeEnum.DISCOUNTS,
    application: ChargeApplicationEnum.QUANTITY,
}

const concepts: Concept[] = [
    {
        id: 1,
        quantity: 1,
        basePrice: 949,
        name: 'Subscripción',
        charges: [charge],
    },
]

const { detailsWithPaymentApplied: traditional } = calculateInvoicePrices<{ name: string }>({
    payment,
    concepts,
    fountType: FountTypeEnum.TRADITIONAL,
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
