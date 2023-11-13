import { Decimal } from 'decimal.js';
import { AmountAndTaxParams, ApplyChargesParams, ApplyPayment, CalculateChargeParams, CalculateInvoiceParams, CalculateInvoicePricesParams, Charge, ConceptAmountDetailsParams, ConceptAmountDetailsResult, Payment } from '../types';
/**
 * Crea un objeto Decimal a partir de un valor.
 * @param {string|number|Decimal} value - El valor decimal.
 * @returns {Decimal} - Un objeto Decimal.
 * Ejemplo: createDecimal('0.01')
 */
export declare const createDecimal: (value: string | number | Decimal) => Decimal;
/**
 * Calcula una factura.
 * @param {Object} params - Parámetros de entrada para el cálculo de la factura.
 * @returns {Object} - Detalles de la factura calculada.
 * Ejemplo: calculateInvoice({ concepts, fountType, ivaPercentage })
 */
export declare const calculateInvoice: <T = any>(params: CalculateInvoiceParams<T>) => ConceptAmountDetailsResult<T>;
/**
 * Calcula los precios de una factura ajustados al pago
 * @param {Object} params - Parámetros de entrada para el cálculo de los precios de la factura.
 * @returns {Object} - Precios calculados de la factura.
 * Ejemplo: calculateInvoicePrices({ payment, concepts, fountType, ivaPercentage })
 */
export declare const calculateInvoicePrices: <T = any>(params: CalculateInvoicePricesParams<T>) => {
    detailsWithPaymentApplied: ConceptAmountDetailsResult<T>;
    detailsWithoutPaymentApplied: ConceptAmountDetailsResult<T>;
};
/**
 * Aplica un pago a los detalles de la factura.
 * @param {Object} params - Parámetros de entrada para la aplicación del pago.
 * @returns {Object} - Detalles de la factura con el pago aplicado.
 * Ejemplo: applyPayment({ details, percentage, ivaPercentage })
 */
export declare const applyPayment: <T = any>(params: ApplyPayment) => ConceptAmountDetailsResult<T>;
/**
 * Obtiene los detalles de los conceptos de la factura.
 * @param {Object} params - Parámetros de entrada para obtener los detalles de los conceptos.
 * @returns {Object} - Detalles de los conceptos de la factura.
 * Ejemplo: getConceptAmountDetails({ concepts, fountType, ivaPercentage })
 */
export declare const getConceptAmountDetails: <T = any>(params: ConceptAmountDetailsParams) => ConceptAmountDetailsResult<T>;
/**
 * Aplica cargos a un monto dado.
 * @param {Object} params - Parámetros de entrada para aplicar los cargos.
 * @returns {Object} - Resultado de la aplicación de cargos.
 * Ejemplo: applyCharges({ amount, charges, fountType })
 */
export declare const applyCharges: (params: ApplyChargesParams) => {
    base: Decimal;
    discounts: Decimal;
    surcharges: Decimal;
    charges: Charge<any>[];
};
/**
 * Calcula un cargo en función de su tipo y aplicación.
 * @param {Object} params - Parámetros de entrada para calcular un cargo.
 * @returns {Object} - Resultado del cálculo del cargo.
 * Ejemplo: calculateCharge({ charge, base })
 */
export declare const calculateCharge: (params: CalculateChargeParams) => {
    base: Decimal;
    amount: Decimal;
    applied: Decimal;
};
/**
 * Obtiene el monto de pago restando el cambio.
 * @param {Object} params - Parámetros de entrada para obtener el monto de pago.
 * @returns {Decimal} - Monto de pago calculado.
 * Ejemplo: getPaymentAmount({ amount, change })
 */
export declare const getPaymentAmount: (params: Payment) => Decimal;
/**
 * Obtiene el monto y el impuesto de un precio con IVA.
 * @param {Object} params - Parámetros de entrada para obtener el monto y el impuesto.
 * @returns {Object} - Monto y impuesto calculados.
 * Ejemplo: getAmountAndTaxFromPriceWithIva({ base, ivaPercentage })
 */
export declare const getAmountAndTaxFromPriceWithIva: (params: AmountAndTaxParams) => {
    base: Decimal;
    amount: Decimal;
    tax: Decimal;
};
/**
 * Obtiene el monto y el impuesto de un precio sin IVA.
 * @param {Object} params - Parámetros de entrada para obtener el monto y el impuesto.
 * @returns {Object} - Monto y impuesto calculados.
 * Ejemplo: getAmountAndTaxFromPriceWithIva({ base, ivaPercentage })
 */
export declare const getAmountAndTaxFromPrice: (params: AmountAndTaxParams) => {
    base: Decimal;
    amount: Decimal;
    tax: Decimal;
};
