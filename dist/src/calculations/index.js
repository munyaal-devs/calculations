"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAmountAndTaxFromPrice = exports.getAmountAndTaxFromPriceWithIva = exports.getPaymentAmount = exports.calculateCharge = exports.applyCharges = exports.getConceptAmountDetails = exports.applyPayment = exports.calculateInvoicePrices = exports.calculateInvoice = exports.createDecimal = void 0;
const decimal_js_1 = require("decimal.js");
const types_1 = require("../types");
// Configuración de la precisión decimal por defecto
decimal_js_1.Decimal.set({ precision: types_1.DecimalDefaultPrecision });
/**
 * Crea un objeto Decimal a partir de un valor.
 * @param {string|number|Decimal} value - El valor decimal.
 * @returns {Decimal} - Un objeto Decimal.
 * Ejemplo: createDecimal('0.01')
 */
const createDecimal = (value) => {
    return new decimal_js_1.Decimal(value);
};
exports.createDecimal = createDecimal;
/**
 * Calcula una factura.
 * @param {Object} params - Parámetros de entrada para el cálculo de la factura.
 * @returns {Object} - Detalles de la factura calculada.
 * Ejemplo: calculateInvoice({ concepts, fountType, ivaPercentage })
 */
const calculateInvoice = (params) => {
    const { concepts, fountType, ivaPercentage } = params;
    return (0, exports.getConceptAmountDetails)({ concepts, fountType, ivaPercentage });
};
exports.calculateInvoice = calculateInvoice;
/**
 * Calcula los precios de una factura ajustados al pago
 * @param {Object} params - Parámetros de entrada para el cálculo de los precios de la factura.
 * @returns {Object} - Precios calculados de la factura.
 * Ejemplo: calculateInvoicePrices({ payment, concepts, fountType, ivaPercentage })
 */
const calculateInvoicePrices = (params) => {
    const { payment, concepts, fountType, ivaPercentage } = params;
    const detailsWithoutPaymentApplied = (0, exports.calculateInvoice)({ concepts, fountType, ivaPercentage });
    const paymentAmount = (0, exports.getPaymentAmount)(payment);
    const paymentPercentage = paymentAmount.div(detailsWithoutPaymentApplied.total || 1);
    let detailsWithPaymentApplied = detailsWithoutPaymentApplied;
    if (!!paymentPercentage.toNumber()) {
        detailsWithPaymentApplied = (0, exports.applyPayment)({
            details: detailsWithoutPaymentApplied,
            percentage: paymentPercentage,
            ivaPercentage
        });
    }
    return {
        detailsWithPaymentApplied,
        detailsWithoutPaymentApplied,
    };
};
exports.calculateInvoicePrices = calculateInvoicePrices;
/**
 * Aplica un pago a los detalles de la factura.
 * @param {Object} params - Parámetros de entrada para la aplicación del pago.
 * @returns {Object} - Detalles de la factura con el pago aplicado.
 * Ejemplo: applyPayment({ details, percentage, ivaPercentage })
 */
const applyPayment = (params) => {
    const { percentage, details: detailsWithoutPayment, ivaPercentage } = params;
    const details = Object.assign({}, detailsWithoutPayment);
    const concepts = [];
    let discount = (0, exports.createDecimal)(0);
    let amount = (0, exports.createDecimal)(0);
    details.concepts.map((value) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        const concept = Object.assign({}, Object.assign({}, value));
        concept.charges.forEach((charge) => {
            var _a;
            charge.chargeAmount = (_a = charge.chargeAmount) === null || _a === void 0 ? void 0 : _a.mul(percentage);
        });
        if (concept.amountWithoutCharges) {
            concept.amountWithoutCharges = (_a = concept.amountWithoutCharges) === null || _a === void 0 ? void 0 : _a.mul(percentage);
        }
        if (concept.amountWithCharges) {
            concept.amountWithCharges = (_b = concept.amountWithCharges) === null || _b === void 0 ? void 0 : _b.mul(percentage);
        }
        if (concept.discountWithIVA) {
            concept.discountWithIVA = (_c = concept.discountWithIVA) === null || _c === void 0 ? void 0 : _c.mul(percentage);
        }
        if (concept.discountWithoutIVA) {
            concept.discountWithoutIVA = (_d = concept.discountWithoutIVA) === null || _d === void 0 ? void 0 : _d.mul(percentage);
        }
        if (concept.chargeWithIVA) {
            concept.chargeWithIVA = (_e = concept.chargeWithIVA) === null || _e === void 0 ? void 0 : _e.mul(percentage);
        }
        if (concept.chargeWithoutIVA) {
            concept.chargeWithoutIVA = (_f = concept.chargeWithoutIVA) === null || _f === void 0 ? void 0 : _f.mul(percentage);
        }
        if ((_g = concept.fiscalPrices) === null || _g === void 0 ? void 0 : _g.unitPrice) {
            concept.fiscalPrices.unitPrice = (_j = (_h = concept.fiscalPrices) === null || _h === void 0 ? void 0 : _h.unitPrice) === null || _j === void 0 ? void 0 : _j.mul(percentage);
        }
        if (typeof ((_k = concept.fiscalPrices) === null || _k === void 0 ? void 0 : _k.amount) !== 'undefined' && typeof ((_l = concept.fiscalPrices) === null || _l === void 0 ? void 0 : _l.discount) !== 'undefined') {
            concept.fiscalPrices.discount = (_o = (_m = concept.fiscalPrices) === null || _m === void 0 ? void 0 : _m.discount) === null || _o === void 0 ? void 0 : _o.mul(percentage);
            discount = discount.add(concept.fiscalPrices.discount);
            concept.fiscalPrices.amount = (_q = (_p = concept.fiscalPrices) === null || _p === void 0 ? void 0 : _p.amount) === null || _q === void 0 ? void 0 : _q.mul(percentage);
            amount = amount.add(concept.fiscalPrices.amount);
            concept.fiscalPrices.baseTax = (_s = (_r = concept.fiscalPrices) === null || _r === void 0 ? void 0 : _r.amount) === null || _s === void 0 ? void 0 : _s.sub(((_t = concept.fiscalPrices) === null || _t === void 0 ? void 0 : _t.discount) || 0);
            const { tax, amount: total } = (0, exports.getAmountAndTaxFromPrice)({
                base: concept.fiscalPrices.baseTax,
                ivaPercentage
            });
            concept.fiscalPrices.tax = tax;
            concept.fiscalPrices.total = total;
        }
        concepts.push(concept);
    });
    const baseTax = amount.sub(discount);
    const { tax, amount: total } = (0, exports.getAmountAndTaxFromPrice)({
        base: baseTax,
        ivaPercentage
    });
    return {
        concepts,
        discount,
        amount,
        baseTax,
        tax,
        total,
    };
};
exports.applyPayment = applyPayment;
/**
 * Obtiene los detalles de los conceptos de la factura.
 * @param {Object} params - Parámetros de entrada para obtener los detalles de los conceptos.
 * @returns {Object} - Detalles de los conceptos de la factura.
 * Ejemplo: getConceptAmountDetails({ concepts, fountType, ivaPercentage })
 */
const getConceptAmountDetails = (params) => {
    const { concepts, fountType, ivaPercentage } = params;
    let discount = (0, exports.createDecimal)(0);
    let amount = (0, exports.createDecimal)(0);
    concepts.forEach((concept) => {
        concept.fiscalPrices = {
            unitPrice: (0, exports.createDecimal)(0),
            baseTax: (0, exports.createDecimal)(0),
            tax: (0, exports.createDecimal)(0),
            amount: (0, exports.createDecimal)(0),
            total: (0, exports.createDecimal)(0),
            discount: (0, exports.createDecimal)(0),
        };
        const charges = concept.charges.sort((a, b) => a.type - b.type);
        concept.basePrice = (0, exports.createDecimal)(concept.basePrice);
        concept.quantity = (0, exports.createDecimal)(concept.quantity);
        concept.amountWithoutCharges = concept.basePrice.mul(concept.quantity);
        const { discounts, surcharges, base, charges: chargesResult } = (0, exports.applyCharges)({
            amount: concept.amountWithoutCharges,
            charges,
            fountType
        });
        concept.amountWithCharges = concept.amountWithoutCharges.add(surcharges).sub(discounts);
        concept.discountWithIVA = discounts;
        const { amount: discountWithoutIVA, } = (0, exports.getAmountAndTaxFromPriceWithIva)({
            base: discounts,
            ivaPercentage
        });
        concept.discountWithoutIVA = discountWithoutIVA;
        concept.chargeWithIVA = surcharges;
        const { amount: chargeWithoutIVA, } = (0, exports.getAmountAndTaxFromPriceWithIva)({
            base: surcharges,
            ivaPercentage
        });
        concept.chargeWithoutIVA = new decimal_js_1.Decimal(chargeWithoutIVA);
        concept.charges = chargesResult;
        const { amount: amountWithSurcharges, } = (0, exports.getAmountAndTaxFromPriceWithIva)({
            base: base.add(surcharges),
            ivaPercentage
        });
        concept.fiscalPrices.unitPrice = amountWithSurcharges.div(concept.quantity);
        const { amount: amountDiscounts, } = (0, exports.getAmountAndTaxFromPriceWithIva)({
            base: discounts,
            ivaPercentage
        });
        concept.fiscalPrices.amount = amountWithSurcharges;
        amount = amount.add(concept.fiscalPrices.amount);
        concept.fiscalPrices.discount = amountDiscounts;
        discount = discount.add(concept.fiscalPrices.discount);
        concept.fiscalPrices.baseTax = amountWithSurcharges.sub(amountDiscounts);
        const { tax: taxTotal, amount: amountTotal, } = (0, exports.getAmountAndTaxFromPrice)({
            base: concept.fiscalPrices.baseTax,
            ivaPercentage
        });
        concept.fiscalPrices.tax = taxTotal;
        concept.fiscalPrices.total = amountTotal;
    });
    const baseTax = amount.sub(discount);
    const { tax, amount: total } = (0, exports.getAmountAndTaxFromPrice)({
        base: baseTax,
        ivaPercentage
    });
    return {
        concepts,
        discount,
        amount,
        baseTax,
        tax,
        total,
    };
};
exports.getConceptAmountDetails = getConceptAmountDetails;
/**
 * Aplica cargos a un monto dado.
 * @param {Object} params - Parámetros de entrada para aplicar los cargos.
 * @returns {Object} - Resultado de la aplicación de cargos.
 * Ejemplo: applyCharges({ amount, charges, fountType })
 */
const applyCharges = (params) => {
    const { amount, fountType } = params;
    let { charges } = params;
    let base = new decimal_js_1.Decimal(amount);
    let discounts = new decimal_js_1.Decimal(0);
    let surcharges = new decimal_js_1.Decimal(0);
    if (fountType === types_1.FountTypeEnum.DISCOUNT_ON_DISCOUNT) {
        const chargesSorted = charges.map((value, index) => (Object.assign(Object.assign({}, value), { order: (value === null || value === void 0 ? void 0 : value.order) || index }))).sort((a, b) => a.order - b.order);
        let variantBase = new decimal_js_1.Decimal(amount);
        chargesSorted.forEach((charge) => {
            const { amount: chargeAmount } = (0, exports.calculateCharge)({ charge, base: variantBase });
            if (charge.type === types_1.ChargeTypeEnum.DISCOUNTS) {
                variantBase = new decimal_js_1.Decimal(variantBase.sub(chargeAmount));
                discounts = new decimal_js_1.Decimal(discounts.add(chargeAmount));
            }
            if (charge.type === types_1.ChargeTypeEnum.SURCHARGES) {
                variantBase = new decimal_js_1.Decimal(variantBase.add(chargeAmount));
                surcharges = new decimal_js_1.Decimal(surcharges.add(chargeAmount));
            }
            charge.chargeAmount = new decimal_js_1.Decimal(chargeAmount);
        });
        charges = chargesSorted;
    }
    if (fountType === types_1.FountTypeEnum.TRADITIONAL) {
        charges.forEach((charge) => {
            const { amount: chargeAmount } = (0, exports.calculateCharge)({ charge, base: new decimal_js_1.Decimal(amount) });
            if (charge.type === types_1.ChargeTypeEnum.DISCOUNTS) {
                discounts = new decimal_js_1.Decimal(discounts.add(chargeAmount));
            }
            if (charge.type === types_1.ChargeTypeEnum.SURCHARGES) {
                surcharges = new decimal_js_1.Decimal(surcharges.add(chargeAmount));
            }
            charge.chargeAmount = new decimal_js_1.Decimal(chargeAmount);
        });
    }
    return {
        base,
        discounts,
        surcharges,
        charges
    };
};
exports.applyCharges = applyCharges;
/**
 * Calcula un cargo en función de su tipo y aplicación.
 * @param {Object} params - Parámetros de entrada para calcular un cargo.
 * @returns {Object} - Resultado del cálculo del cargo.
 * Ejemplo: calculateCharge({ charge, base })
 */
const calculateCharge = (params) => {
    const { charge: { amount, application, type }, base } = params;
    const x = (0, exports.createDecimal)(base);
    const y = (0, exports.createDecimal)(amount);
    let z = (0, exports.createDecimal)(amount);
    if (application === types_1.ChargeApplicationEnum.PERCENTAGE) {
        z = x.mul(y).div(100);
    }
    switch (type) {
        case types_1.ChargeTypeEnum.DISCOUNTS:
            return {
                base: x,
                amount: z,
                applied: x.sub(z),
            };
        case types_1.ChargeTypeEnum.SURCHARGES:
            return {
                base: x,
                amount: z,
                applied: x.add(z),
            };
        default:
            return {
                base: x,
                amount: z,
                applied: x,
            };
    }
};
exports.calculateCharge = calculateCharge;
/**
 * Obtiene el monto de pago restando el cambio.
 * @param {Object} params - Parámetros de entrada para obtener el monto de pago.
 * @returns {Decimal} - Monto de pago calculado.
 * Ejemplo: getPaymentAmount({ amount, change })
 */
const getPaymentAmount = (params) => {
    const { amount, change } = params;
    const x = (0, exports.createDecimal)(amount);
    const y = (0, exports.createDecimal)(change);
    return x.sub(y);
};
exports.getPaymentAmount = getPaymentAmount;
/**
 * Obtiene el monto y el impuesto de un precio con IVA.
 * @param {Object} params - Parámetros de entrada para obtener el monto y el impuesto.
 * @returns {Object} - Monto y impuesto calculados.
 * Ejemplo: getAmountAndTaxFromPriceWithIva({ base, ivaPercentage })
 */
const getAmountAndTaxFromPriceWithIva = (params) => {
    const base = (0, exports.createDecimal)(params.base);
    const percentage = (0, exports.createDecimal)(params.ivaPercentage).add(1);
    const amount = base.div(percentage);
    const tax = amount.mul(percentage);
    return {
        base,
        amount,
        tax
    };
};
exports.getAmountAndTaxFromPriceWithIva = getAmountAndTaxFromPriceWithIva;
/**
 * Obtiene el monto y el impuesto de un precio sin IVA.
 * @param {Object} params - Parámetros de entrada para obtener el monto y el impuesto.
 * @returns {Object} - Monto y impuesto calculados.
 * Ejemplo: getAmountAndTaxFromPriceWithIva({ base, ivaPercentage })
 */
const getAmountAndTaxFromPrice = (params) => {
    const base = (0, exports.createDecimal)(params.base);
    const percentage = (0, exports.createDecimal)(params.ivaPercentage);
    const tax = base.mul(percentage);
    const amount = base.add(tax);
    return {
        base,
        amount,
        tax
    };
};
exports.getAmountAndTaxFromPrice = getAmountAndTaxFromPrice;
