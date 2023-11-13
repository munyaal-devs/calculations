"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargeApplicationEnum = exports.ChargeTypeEnum = exports.FountTypeEnum = exports.TaxPercentageEnum = exports.DecimalDefaultPrecision = void 0;
const decimal_js_1 = require("decimal.js");
/**
 * Configuración de la precisión decimal por defecto.
 */
exports.DecimalDefaultPrecision = 15;
// Configuración de la precisión decimal por defecto
decimal_js_1.Decimal.set({ precision: exports.DecimalDefaultPrecision });
/**
 * Enumeración de porcentajes de impuestos.
 */
var TaxPercentageEnum;
(function (TaxPercentageEnum) {
    /**
     * No hay impuestos (0%).
     */
    TaxPercentageEnum[TaxPercentageEnum["T0"] = 0] = "T0";
    /**
     * Impuesto del 14%.
     */
    TaxPercentageEnum[TaxPercentageEnum["T14"] = 0.14] = "T14";
    /**
     * Impuesto del 16%.
     */
    TaxPercentageEnum[TaxPercentageEnum["T16"] = 0.16] = "T16";
    /**
     * Impuesto del 18%.
     */
    TaxPercentageEnum[TaxPercentageEnum["T18"] = 0.18] = "T18";
})(TaxPercentageEnum = exports.TaxPercentageEnum || (exports.TaxPercentageEnum = {}));
/**
 * Enumeración de tipos de aplicación de cargos.
 */
var FountTypeEnum;
(function (FountTypeEnum) {
    /**
     * Los cargos se calculan sobre el precio total original en cada paso sin considerar cargos previos.
     * */
    FountTypeEnum[FountTypeEnum["TRADITIONAL"] = 1] = "TRADITIONAL";
    /**
     * Cada cargo se calcula y aplica al precio total, reduciendo la base para el próximo cálculo. Los cargos se aplican secuencialmente sobre la base ajustada.
     * */
    FountTypeEnum[FountTypeEnum["DISCOUNT_ON_DISCOUNT"] = 2] = "DISCOUNT_ON_DISCOUNT";
})(FountTypeEnum = exports.FountTypeEnum || (exports.FountTypeEnum = {}));
/**
 * Enumeración de tipos de cargo.
 */
var ChargeTypeEnum;
(function (ChargeTypeEnum) {
    /**
     * Descuento
     */
    ChargeTypeEnum[ChargeTypeEnum["DISCOUNTS"] = 1] = "DISCOUNTS";
    /**
     * Cargo
     */
    ChargeTypeEnum[ChargeTypeEnum["SURCHARGES"] = 2] = "SURCHARGES";
})(ChargeTypeEnum = exports.ChargeTypeEnum || (exports.ChargeTypeEnum = {}));
/**
 * Enumeración de tipos de aplicación de cargo.
 */
var ChargeApplicationEnum;
(function (ChargeApplicationEnum) {
    /**
     * Porcentaje
     */
    ChargeApplicationEnum[ChargeApplicationEnum["PERCENTAGE"] = 1] = "PERCENTAGE";
    /**
     * Cantidad
     */
    ChargeApplicationEnum[ChargeApplicationEnum["QUANTITY"] = 2] = "QUANTITY";
})(ChargeApplicationEnum = exports.ChargeApplicationEnum || (exports.ChargeApplicationEnum = {}));
