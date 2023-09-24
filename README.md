# Documentación de la Librería de Cálculo de Facturas

## Descripción

La Librería de Cálculo de Facturas proporciona una serie de funciones y utilidades para calcular detalles de
facturación, aplicar cargos, descuentos y pagos, y obtener montos e impuestos relacionados con facturas.

## Instalación

Para utilizar esta librería en tu proyecto, puedes instalarla a través de NPM utilizando el siguiente comando:

```
npm i @munyaal/cfdi-catalogs
```

## Uso básico

Para utilizar las funciones proporcionadas por esta librería en tu código, primero debes importarlas de la siguiente
manera:

```typescript
import {
    createDecimal,
    calculateInvoice,
    calculateInvoicePrices,
    applyPayment,
    applyCharges,
    calculateCharge,
    getPaymentAmount,
    getAmountAndTaxFromPriceWithIva,
    getAmountAndTaxFromPrice,
} from '@munyaal/cfdi-catalogs';
```

Luego, puedes utilizar estas funciones según tus necesidades en tu aplicación.

## Función `createDecimal`

La función `createDecimal` crea un objeto Decimal a partir de un valor dado.

### Uso

```typescript
const value = '0.01';

const decimalValue = createDecimal(value);
```

## Función `calculateInvoice`

La función `calculateInvoice` calcula una factura en función de los conceptos, el tipo de fuente y el porcentaje de IVA.

### Uso

```typescript
const invoiceDetails = calculateInvoice({
    concepts,
    fountType,
    ivaPercentage,
});
```

## Función `calculateInvoicePrices`

La función `calculateInvoicePrices` calcula los precios de una factura ajustados al pago.

### Uso

```typescript
const invoicePrices = calculateInvoicePrices({
    payment,
    concepts,
    fountType,
    ivaPercentage,
});
```

## Función `applyPayment`

La función `applyPayment` aplica un pago a los detalles de la factura.

### Uso

```typescript
const detailsWithPayment = applyPayment({
    details,
    percentage,
    ivaPercentage,
});
```

## Función `applyCharges`

La función `applyCharges` aplica cargos a un monto dado.

### Uso

```typescript
const chargeResult = applyCharges({
    amount,
    charges,
    fountType,
});
```

## Función `calculateCharge`

La función `calculateCharge` calcula un cargo en función de su tipo y aplicación.

### Uso

```typescript
const chargeResult = calculateCharge({
    charge,
    base,
});
```

## Función `getPaymentAmount`

La función `getPaymentAmount` obtiene el monto de pago restando el cambio.

### Uso

```typescript
const paymentAmount = getPaymentAmount({
    amount,
    change,
});
```

## Función `getAmountAndTaxFromPriceWithIva`

La función `getAmountAndTaxFromPriceWithIva` obtiene el monto y el impuesto de un precio con IVA.

### Uso

```typescript
const result = getAmountAndTaxFromPriceWithIva({
    base,
    ivaPercentage,
});
```

## Función `getAmountAndTaxFromPrice`

La función `getAmountAndTaxFromPrice` obtiene el monto y el impuesto de un precio sin IVA.

### Uso

```typescript
const result = getAmountAndTaxFromPrice({
    base,
    ivaPercentage,
});
```

## Ejemplo de uso

A continuación, se muestra un ejemplo de cómo utilizar las funciones de la librería para calcular una factura con
conceptos y cargos personalizados:

```typescript
import {
    calculateInvoice,
    Charge,
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    FountTypeEnum,
    TaxPercentageEnum,
} from 'tu-libreria-de-calculo-facturas';

// Definición de cargos personalizados
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
];

// Definición de conceptos
const concepts: Concept[] = [
    {
        id: 1,
        quantity: 1,
        basePrice: 1000.00,
        name: 'Mensualidad de zumba - junio',
        charges,
    },
    {
        id: 2,
        quantity: 2,
        basePrice: 1500.00,
        name: 'Mensualidad de zumba - julio',
        charges,
    },
];

// Cálculo de la factura en modo tradicional
const traditional = calculateInvoice({
    concepts,
    fountType: FountTypeEnum.TRADITIONAL,
    ivaPercentage: TaxPercentageEnum.T16,
});

// Impresión de los detalles de los conceptos
traditional.concepts.forEach((value) => {
    console.log(`Producto - ${value.name}`);

    console.log(`Cantidad               $ `, value?.quantity?.toFixed(6).toString());
    console.log(`Precio unitario        $ `, value?.fiscalPrices?.unitPrice?.toFixed(6).toString());
    console.log(`Importe                $ `, value?.fiscalPrices?.amount?.toFixed(6).toString());
    console.log(`Descuento              $ `, value?.fiscalPrices?.discount?.toFixed(6).toString());
    console.log(`Base de impuestos      $ `, value?.fiscalPrices?.baseTax?.toFixed(6).toString());
    console.log(`Impuesto               $ `, value?.fiscalPrices?.tax?.toFixed(6).toString());
    console.log('\n');
});

// Impresión de los impuestos y el comprobante
console.log('Impuestos \n \n');
console.log(`Base de impuestos      $ `, traditional.baseTax?.toFixed(6).toString());
console.log(`Impuesto               $ `, traditional.tax?.toFixed(6).toString());
console.log('Comprobante \n \n');
console.log(`Importe                $ `, traditional.amount?.toFixed(6).toString());
console.log(`Descuento              $ `, traditional.discount?.toFixed(6).toString());
console.log(`Impuesto               $ `, traditional.tax?.toFixed(6).toString());
console.log(`Total                  $ `, traditional.total?.toFixed(6).toString());
```

Asegúrate de ajustar los valores y las variables en el ejemplo de acuerdo a tus necesidades específicas. Esta es una
muestra de cómo puedes utilizar las funciones de la librería para calcular y obtener detalles de facturación
personalizados.

## Contribución

Si deseas contribuir a esta librería o informar sobre problemas, puedes hacerlo a través del repositorio de GitHub
en https://github.com/munyaal/calculations.
