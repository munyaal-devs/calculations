### Estructura básica de concepto

```typescript
const concept = {
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

```typescript
const charge = [
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
