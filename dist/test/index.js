"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const charges = [
    {
        order: 1,
        amount: 0.05,
        type: src_1.ChargeTypeEnum.DISCOUNTS,
        application: src_1.ChargeApplicationEnum.PERCENTAGE,
    },
    {
        order: 2,
        amount: 20,
        type: src_1.ChargeTypeEnum.DISCOUNTS,
        application: src_1.ChargeApplicationEnum.QUANTITY,
    },
    {
        order: 3,
        amount: 15,
        type: src_1.ChargeTypeEnum.SURCHARGES,
        application: src_1.ChargeApplicationEnum.QUANTITY,
    },
    {
        order: 4,
        amount: 0.03,
        type: src_1.ChargeTypeEnum.SURCHARGES,
        application: src_1.ChargeApplicationEnum.PERCENTAGE,
    }
];
const concepts = [
    {
        id: 1,
        quantity: 1,
        basePrice: 120.00,
        name: 'Mensualidad de zumba - junio',
        charges
    }
];
const traditional = (0, src_1.calculateInvoice)({
    concepts,
    fountType: src_1.FountTypeEnum.DISCOUNT_ON_DISCOUNT,
    ivaPercentage: src_1.TaxPercentageEnum.T0
});
traditional.concepts.forEach((value) => {
    var _a, _b, _c, _d, _e, _f;
    console.log(`Producto - ${value.name}`);
    console.log(`Cantidad               $ `, (_a = value === null || value === void 0 ? void 0 : value.quantity) === null || _a === void 0 ? void 0 : _a.toFixed(6).toString());
    console.log(`Precio unitario        $ `, (_b = value === null || value === void 0 ? void 0 : value.basePrice) === null || _b === void 0 ? void 0 : _b.toFixed(6).toString());
    console.log(`Importe                $ `, (_c = value === null || value === void 0 ? void 0 : value.amountWithoutCharges) === null || _c === void 0 ? void 0 : _c.toFixed(6).toString());
    console.log(`Cargo                  $ `, (_d = value === null || value === void 0 ? void 0 : value.chargeWithIVA) === null || _d === void 0 ? void 0 : _d.toFixed(6).toString());
    console.log(`Descuento              $ `, (_e = value === null || value === void 0 ? void 0 : value.discountWithIVA) === null || _e === void 0 ? void 0 : _e.toFixed(6).toString());
    console.log(`Total                  $ `, (_f = value === null || value === void 0 ? void 0 : value.amountWithCharges) === null || _f === void 0 ? void 0 : _f.toFixed(6).toString());
    console.log('\n');
});
console.log('Impuestos \n \n');
console.log(`Base de impuestos      $ `, (_a = traditional.baseTax) === null || _a === void 0 ? void 0 : _a.toFixed(6).toString());
console.log(`Impuesto               $ `, (_b = traditional.tax) === null || _b === void 0 ? void 0 : _b.toFixed(6).toString());
console.log('Comprobante \n \n');
console.log(`Importe                $ `, (_c = traditional.amount) === null || _c === void 0 ? void 0 : _c.toFixed(6).toString());
console.log(`Descuento              $ `, (_d = traditional.discount) === null || _d === void 0 ? void 0 : _d.toFixed(6).toString());
console.log(`Impuesto               $ `, (_e = traditional.tax) === null || _e === void 0 ? void 0 : _e.toFixed(6).toString());
console.log(`Total                  $ `, (_f = traditional.total) === null || _f === void 0 ? void 0 : _f.toFixed(6).toString());
