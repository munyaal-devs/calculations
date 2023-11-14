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
        amount: 0.05,
        type: ChargeTypeEnum.DISCOUNTS,
        application: ChargeApplicationEnum.PERCENTAGE,
    },
    {
        order: 2,
        amount: 20,
        type: ChargeTypeEnum.DISCOUNTS,
        application: ChargeApplicationEnum.QUANTITY,
    },
    {
        order: 3,
        amount: 15,
        type: ChargeTypeEnum.SURCHARGES,
        application: ChargeApplicationEnum.QUANTITY,
    },
    {
        order: 4,
        amount: 0.03,
        type: ChargeTypeEnum.SURCHARGES,
        application: ChargeApplicationEnum.PERCENTAGE,
    }
]

const concepts: Concept[] = [
    {
        id: 1,
        quantity: 1,
        basePrice: 120.00,
        name: 'Mensualidad de zumba - junio',
        charges
    }
];

const traditional = calculateInvoice({
    concepts,
    fountType: FountTypeEnum.DISCOUNT_ON_DISCOUNT,
    ivaPercentage: TaxPercentageEnum.T0
});


traditional.concepts.forEach((value) => {
    console.log(`Producto - ${value.name}`);

    console.log(`Cantidad               $ `, value?.quantity?.toFixed(6).toString())


    console.log(`Precio unitario        $ `, value?.basePrice?.toFixed(6).toString())
    console.log(`Importe                $ `, value?.amountWithoutCharges?.toFixed(6).toString())
    console.log(`Cargo                  $ `, value?.chargeWithIVA?.toFixed(6).toString())
    console.log(`Descuento              $ `, value?.discountWithIVA?.toFixed(6).toString())

    console.log(`Total                  $ `, value?.amountWithCharges?.toFixed(6).toString())

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
