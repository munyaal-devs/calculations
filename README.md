# @munyaal/calculations

Esta es una librería para realizar las operaciones comunes de un punto de venta, así como las operaciones para un recibo
o una factura fiscal

### Características

- Especifica el porcentaje exacto de los impuestos.
- Especifica un arreglo de cargos
  - Descuentos
  - Cargos
  - Porcentaje
  - Cantidad
- Continúa haciendo operaciones
- Se exporta la clase 

### Estructura básica de concepto

El concepto representa al producto o servicio que se necesita calcular

```typescript
import { Concept } from '@munyaal/calculations'

const concept: Concept = {
    id: 1,
    name: 'Mochila verde',
    price: 450,
    quantity: 2,
    charges: []
}
```

| Atributo | Uso           | Tipo de dato      | Descripción                                     |
|----------|---------------|-------------------|-------------------------------------------------|
| id       | obligatorio   | string or number  | Identificador único del producto o servicio     |
| name     | obligatorio   | string            | Nombre del producto o servicio                  |
| price    | obligatorio   | number            | Precio unitario con IVA del producto o servicio |
| quantity | obligatorio   | number or Decimal | Cantidad de productos o servicios               |
| charges  | obligatorio   | Charge Array      | Lista de cargos para aplicar                    |

### Estructura básica de un cargo

Son los cargos que se deben aplicar al concepto antes de calcular los detalles de venta

```typescript
import { Charge } from '@munyaal/calculations'

const charge: Charge[] = [
    {
        amount: 20,
        type: ChargeTypeEnum.SURCHARGES,
        application: ChargeApplicationEnum.QUANTITY
    },
    {
        amount: 5,
        type: ChargeTypeEnum.DISCOUNTS,
        application: ChargeApplicationEnum.PERCENTAGE
    },
    {
        amount: 5,
        type: ChargeTypeEnum.DISCOUNTS,
        application: ChargeApplicationEnum.QUANTITY
    }
]
```

| Atributo    | Tipo de dato           | Descripción                                         |
|-------------|------------------------|-----------------------------------------------------|
| amount      | number                 | Puede representar una cantidad fija o un porcentaje |
| type        | ChargeTypeEnum         | Especifica si es un cargo o un descuento            |
| application | ChargeApplicationEnum  | Especifica si es una cantidad o un porcentaje       |

#### ChargeTypeEnum

```typescript
/*
* Tipo de cargo
*
* @Discounts - Descuento
* @Surcharges - Cargos
* */

export enum ChargeTypeEnum {
  DISCOUNTS = 1,
  SURCHARGES = 2,
}
```

#### ChargeApplicationEnum

```typescript
/*
* Tipo de aplicación
*
* @PERCENTAGE - Descuento
* @QUANTITY - Cargos
* */

export enum ChargeApplicationEnum {
  PERCENTAGE = 1,
  QUANTITY = 2,
}
```

### Estructura del pago

Es el pago realizado por el cliente

```typescript
import { Payment } from '@munyaal/calculations'

const payment: Payment = {
  amount: 500.00,
  change: 50.00
};

```

| Atributo    | Tipo de dato           | Descripción                                       |
|-------------|------------------------|---------------------------------------------------|
| amount      | number                 | Representa la cantidad con la que pago el cliente |
| change      | number                 | Representa el cambio del cliente                  |

### Realizar las operaciones

Es una función que realiza todas las operaciones necesarias

```typescript
import { calculateInvoicePrices } from '@munyaal/calculations'

const {detailsWithPaymentApplied: traditional} = calculateInvoicePrices({
  payment,
  concepts,
  fountType: FountTypeEnum.TRADITIONAL,
  ivaPercentage: TaxPercentageEnum.T16
});
```

| Atributo      | Tipo de dato      | Descripción                                      |
|---------------|-------------------|--------------------------------------------------|
| payment       | Payment           | Pago realizado (puede ir en 0)                   |
| concepts      | Concept Array     | Arreglo de conceptos que se desean calcular      |
| fountType     | FountTypeEnum     | Especifica como debe aplicar los cargos          |
| ivaPercentage | TaxPercentageEnum | Especifica el porcentaje del impuesto a calcular |

#### FountTypeEnum

```typescript
/*
* Tipo de cargo
*
* @TRADITIONAL - Cargos de forma tradicional
* @DISCOUNT_ON_DISCOUNT - Descuento sobre descuentos
* */

export enum FountTypeEnum {
  TRADITIONAL = 1,
  DISCOUNT_ON_DISCOUNT = 2,
}
```

#### TaxPercentageEnum

```typescript

export enum TaxPercentageEnum {
  T0 = 0,
  T14 = 0.14,
  T16 = 0.16,
  T18 = 0.18
}
```

### Ejemplo

#### Estructura

```typescript
import {
  calculateInvoicePrices,
  Charge,
  ChargeApplicationEnum,
  ChargeTypeEnum,
  Concept,
  FountTypeEnum,
  Payment,
  TaxPercentageEnum,
} from '@munyaal/calculations';

const payment: Payment = {
  amount: 5000.00,
  change: 320.00
};

const charge: Charge = {
  amount: 10,
  type: ChargeTypeEnum.DISCOUNTS,
  application: ChargeApplicationEnum.PERCENTAGE,
}

const concepts: Concept[] = [
  {
    id: 1,
    quantity: 1,
    basePrice: 5200.00,
    name: 'Bobina de cable UTP cat6 uso rudo',
    charges: [charge],
  },
]

const result = calculateInvoicePrices({
  payment,
  concepts,
  fountType: FountTypeEnum.TRADITIONAL,
  ivaPercentage: TaxPercentageEnum.T16
});
```

Existen dos resultados correctos.

##### detailsWithPaymentApplied

Este resultado realiza las operaciones considerando el pago el cliente y sacan un 
porcentaje equivalente al pago

##### detailsWithoutPaymentApplied

Este resultado realiza las operaciones sin considerar el pago realizado por el cliente

```json

{
   "detailsWithPaymentApplied": {
      "concepts": [
         {
            "id": 1,
            "quantity": "1",
            "basePrice": "5200",
            "name": "Bobina de cable UTP cat6 uso rudo",
            "charges": [
               {
                  "amount": 10,
                  "type": 1,
                  "application": 1,
                  "chargeAmount": "520"
               }
            ],
            "fiscalPrices": {
               "unitPrice": "4482.7586206896551724",
               "baseTax": "4034.4827586206896552",
               "tax": "645.51724137931034483",
               "amount": "4482.7586206896551724",
               "total": "4680",
               "discount": "448.27586206896551724"
            },
            "amountWithoutCharges": "5200",
            "amountWithCharges": "4680",
            "discountWithIVA": "0",
            "discountWithoutIVA": "0",
            "chargeWithIVA": "0",
            "chargeWithoutIVA": "0"
         }
      ],
      "discount": "448.27586206896551724",
      "amount": "4482.7586206896551724",
      "baseTax": "4034.4827586206896552",
      "tax": "645.51724137931034483",
      "total": "4680"
   },
   "detailsWithoutPaymentApplied": {
      "concepts": [
         {
            "id": 1,
            "quantity": "1",
            "basePrice": "5200",
            "name": "Bobina de cable UTP cat6 uso rudo",
            "charges": [
               {
                  "amount": 10,
                  "type": 1,
                  "application": 1,
                  "chargeAmount": "520"
               }
            ],
            "fiscalPrices": {
               "unitPrice": "4482.7586206896551724",
               "baseTax": "4034.4827586206896552",
               "tax": "645.51724137931034483",
               "amount": "4482.7586206896551724",
               "total": "4680",
               "discount": "448.27586206896551724"
            },
            "amountWithoutCharges": "5200",
            "amountWithCharges": "4680",
            "discountWithIVA": "0",
            "discountWithoutIVA": "0",
            "chargeWithIVA": "0",
            "chargeWithoutIVA": "0"
         }
      ],
      "discount": "448.27586206896551724",
      "amount": "4482.7586206896551724",
      "baseTax": "4034.4827586206896552",
      "tax": "645.51724137931034483",
      "total": "4680"
   }
}

```

#### Resultado
