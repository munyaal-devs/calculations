"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const charges = [
    {
        order: 1,
        amount: 20,
        type: src_1.ChargeTypeEnum.DISCOUNTS,
        application: src_1.ChargeApplicationEnum.QUANTITY,
    },
    {
        order: 2,
        amount: 5,
        type: src_1.ChargeTypeEnum.DISCOUNTS,
        application: src_1.ChargeApplicationEnum.PERCENTAGE,
    },
];
const concepts = [
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
const traditional = (0, src_1.calculateInvoice)({
    concepts,
    fountType: src_1.FountTypeEnum.TRADITIONAL,
    ivaPercentage: src_1.TaxPercentageEnum.T16
});
traditional.concepts.forEach((value) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    console.log(`Producto - ${value.name}`);
    console.log(`Cantidad               $ `, (_a = value === null || value === void 0 ? void 0 : value.quantity) === null || _a === void 0 ? void 0 : _a.toFixed(6).toString());
    console.log(`Precio unitario        $ `, (_c = (_b = value === null || value === void 0 ? void 0 : value.fiscalPrices) === null || _b === void 0 ? void 0 : _b.unitPrice) === null || _c === void 0 ? void 0 : _c.toFixed(6).toString());
    console.log(`Importe                $ `, (_e = (_d = value === null || value === void 0 ? void 0 : value.fiscalPrices) === null || _d === void 0 ? void 0 : _d.amount) === null || _e === void 0 ? void 0 : _e.toFixed(6).toString());
    console.log(`Descuento              $ `, (_g = (_f = value === null || value === void 0 ? void 0 : value.fiscalPrices) === null || _f === void 0 ? void 0 : _f.discount) === null || _g === void 0 ? void 0 : _g.toFixed(6).toString());
    console.log(`Base de impuestos      $ `, (_j = (_h = value === null || value === void 0 ? void 0 : value.fiscalPrices) === null || _h === void 0 ? void 0 : _h.baseTax) === null || _j === void 0 ? void 0 : _j.toFixed(6).toString());
    console.log(`Impuesto               $ `, (_l = (_k = value === null || value === void 0 ? void 0 : value.fiscalPrices) === null || _k === void 0 ? void 0 : _k.tax) === null || _l === void 0 ? void 0 : _l.toFixed(6).toString());
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
