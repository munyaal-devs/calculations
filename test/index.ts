import {
    calculateInvoice,
    Charge,
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    FountTypeEnum,
    TaxPercentageEnum,
} from '../src';

const charges: Charge[] = [
    {
        order: 1,
        amount: 20,
        type: ChargeTypeEnum.DISCOUNTS,
        application: ChargeApplicationEnum.QUANTITY,
    },
    {
        order: 2,
        amount: 5,
        type: ChargeTypeEnum.DISCOUNTS,
        application: ChargeApplicationEnum.PERCENTAGE,
    },
]

const concepts: Concept[] = [
    {
        id: 1,
        quantity: 1,
        basePrice: 1000.00,
        name: 'Mensualidad de zumba - junio',
        charges
    },
    {
        id: 2,
        quantity: 2,
        basePrice: 1500.00,
        name: 'Mensualidad de zumba - julio',
        charges
    },
];

const traditional = calculateInvoice({
    concepts,
    fountType: FountTypeEnum.TRADITIONAL,
    ivaPercentage: TaxPercentageEnum.T16
});


traditional.concepts.forEach((value) => {
    console.log(`Producto - ${value.name}`);

    console.log(`Cantidad               $ `, value?.quantity?.toFixed(6).toString())


    console.log(`Precio unitario        $ `, value?.fiscalPrices?.unitPrice?.toFixed(6).toString())
    console.log(`Importe                $ `, value?.fiscalPrices?.amount?.toFixed(6).toString())
    console.log(`Descuento              $ `, value?.fiscalPrices?.discount?.toFixed(6).toString())

    console.log(`Base de impuestos      $ `, value?.fiscalPrices?.baseTax?.toFixed(6).toString())
    console.log(`Impuesto               $ `, value?.fiscalPrices?.tax?.toFixed(6).toString())

    console.log('\n')
})

console.log('Impuestos \n \n')

console.log(`Base de impuestos      $ `, traditional.baseTax?.toFixed(6).toString())
console.log(`Impuesto               $ `, traditional.tax?.toFixed(6).toString())

console.log('Comprobante \n \n')
console.log(`Importe                $ `, traditional.amount?.toFixed(6).toString())
console.log(`Descuento              $ `, traditional.discount?.toFixed(6).toString())
console.log(`Impuesto               $ `, traditional.tax?.toFixed(6).toString())
console.log(`Total                  $ `, traditional.total?.toFixed(6).toString())
