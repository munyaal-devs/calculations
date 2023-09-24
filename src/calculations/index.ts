import { Decimal } from 'decimal.js';
import {
    AmountAndTaxParams,
    ApplyChargesParams,
    ApplyPayment,
    CalculateChargeParams,
    CalculateInvoiceParams,
    CalculateInvoicePricesParams,
    Charge,
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    ConceptAmountDetailsParams,
    ConceptAmountDetailsResult,
    DecimalDefaultPrecision,
    FountTypeEnum,
    Payment
} from '../types';

// Configuración de la precisión decimal por defecto
Decimal.set({precision: DecimalDefaultPrecision});

/**
 * Crea un objeto Decimal a partir de un valor.
 * @param {string|number|Decimal} value - El valor decimal.
 * @returns {Decimal} - Un objeto Decimal.
 * Ejemplo: createDecimal('0.01')
 */
export const createDecimal = (value: string | number | Decimal): Decimal => {
    return new Decimal(value);
};

/**
 * Calcula una factura.
 * @param {Object} params - Parámetros de entrada para el cálculo de la factura.
 * @returns {Object} - Detalles de la factura calculada.
 * Ejemplo: calculateInvoice({ concepts, fountType, ivaPercentage })
 */
export const calculateInvoice = <T = any>(params: CalculateInvoiceParams<T>): ConceptAmountDetailsResult<T> => {
    const {concepts, fountType, ivaPercentage} = params;

    return getConceptAmountDetails<T>({concepts, fountType, ivaPercentage})
}

/**
 * Calcula los precios de una factura ajustados al pago
 * @param {Object} params - Parámetros de entrada para el cálculo de los precios de la factura.
 * @returns {Object} - Precios calculados de la factura.
 * Ejemplo: calculateInvoicePrices({ payment, concepts, fountType, ivaPercentage })
 */
export const calculateInvoicePrices = <T = any>(params: CalculateInvoicePricesParams<T>) => {
    const {payment, concepts, fountType, ivaPercentage} = params;

    const detailsWithoutPaymentApplied = calculateInvoice<T>({concepts, fountType, ivaPercentage});

    const paymentAmount = getPaymentAmount(payment);

    const paymentPercentage = paymentAmount.div(detailsWithoutPaymentApplied.total || 1);

    let detailsWithPaymentApplied = detailsWithoutPaymentApplied;

    if (!!paymentPercentage.toNumber()) {
        detailsWithPaymentApplied = applyPayment<T>({
            details: detailsWithoutPaymentApplied,
            percentage: paymentPercentage,
            ivaPercentage
        })
    }


    return {
        detailsWithPaymentApplied,
        detailsWithoutPaymentApplied,
    };
}

/**
 * Aplica un pago a los detalles de la factura.
 * @param {Object} params - Parámetros de entrada para la aplicación del pago.
 * @returns {Object} - Detalles de la factura con el pago aplicado.
 * Ejemplo: applyPayment({ details, percentage, ivaPercentage })
 */
export const applyPayment = <T = any>(params: ApplyPayment): ConceptAmountDetailsResult<T> => {
    const {percentage, details: detailsWithoutPayment, ivaPercentage} = params;

    const details = Object.assign({}, detailsWithoutPayment)

    const concepts: Concept<T>[] = [];

    let discount = createDecimal(0);
    let amount = createDecimal(0);

    details.concepts.map((value: Concept<T>) => {
        const concept = Object.assign({}, {...value});

        concept.charges.forEach((charge: Charge) => {
            charge.chargeAmount = charge.chargeAmount?.mul(percentage);
        })

        if (concept.amountWithoutCharges) {
            concept.amountWithoutCharges = concept.amountWithoutCharges?.mul(percentage);
        }

        if (concept.amountWithCharges) {
            concept.amountWithCharges = concept.amountWithCharges?.mul(percentage);
        }

        if (concept.discountWithIVA) {
            concept.discountWithIVA = concept.discountWithIVA?.mul(percentage);
        }

        if (concept.discountWithoutIVA) {
            concept.discountWithoutIVA = concept.discountWithoutIVA?.mul(percentage);
        }

        if (concept.chargeWithIVA) {
            concept.chargeWithIVA = concept.chargeWithIVA?.mul(percentage);
        }

        if (concept.chargeWithoutIVA) {
            concept.chargeWithoutIVA = concept.chargeWithoutIVA?.mul(percentage);
        }

        if (concept.fiscalPrices?.unitPrice) {
            concept.fiscalPrices.unitPrice = concept.fiscalPrices?.unitPrice?.mul(percentage);
        }

        if (typeof concept.fiscalPrices?.amount !== 'undefined' && typeof concept.fiscalPrices?.discount !== 'undefined') {
            concept.fiscalPrices.discount = concept.fiscalPrices?.discount?.mul(percentage);
            discount = discount.add(concept.fiscalPrices.discount);

            concept.fiscalPrices.amount = concept.fiscalPrices?.amount?.mul(percentage);
            amount = amount.add(concept.fiscalPrices.amount);

            concept.fiscalPrices.baseTax = concept.fiscalPrices?.amount?.sub(concept.fiscalPrices?.discount || 0);

            const {
                tax,
                amount: total
            } = getAmountAndTaxFromPrice({
                base: concept.fiscalPrices.baseTax,
                ivaPercentage
            });

            concept.fiscalPrices.tax = tax
            concept.fiscalPrices.total = total
        }

        concepts.push(concept)
    });

    const baseTax = amount.sub(discount);

    const {
        tax,
        amount: total
    } = getAmountAndTaxFromPrice({
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
    }
}

/**
 * Obtiene los detalles de los conceptos de la factura.
 * @param {Object} params - Parámetros de entrada para obtener los detalles de los conceptos.
 * @returns {Object} - Detalles de los conceptos de la factura.
 * Ejemplo: getConceptAmountDetails({ concepts, fountType, ivaPercentage })
 */
export const getConceptAmountDetails = <T = any>(params: ConceptAmountDetailsParams): ConceptAmountDetailsResult<T> => {
    const {concepts, fountType, ivaPercentage} = params;

    let discount = createDecimal(0);
    let amount = createDecimal(0);

    concepts.forEach((concept: Concept) => {
        concept.fiscalPrices = {
            unitPrice: createDecimal(0),
            baseTax: createDecimal(0),
            tax: createDecimal(0),
            amount: createDecimal(0),
            total: createDecimal(0),
            discount: createDecimal(0),
        };

        const charges = concept.charges.sort((a, b) => a.type - b.type);

        concept.basePrice = createDecimal(concept.basePrice);
        concept.quantity = createDecimal(concept.quantity);

        concept.amountWithoutCharges = concept.basePrice.mul(concept.quantity);

        const {discounts, surcharges, base, charges: chargesResult} = applyCharges({
            amount: concept.amountWithoutCharges,
            charges,
            fountType
        });

        concept.amountWithCharges = concept.amountWithoutCharges.add(surcharges).sub(discounts);

        concept.discountWithIVA = discounts;

        const {
            amount: discountWithoutIVA,
        } = getAmountAndTaxFromPriceWithIva({
            base: discounts,
            ivaPercentage
        });

        concept.discountWithoutIVA = discountWithoutIVA;

        concept.chargeWithIVA = surcharges;

        const {
            amount: chargeWithoutIVA,
        } = getAmountAndTaxFromPriceWithIva({
            base: surcharges,
            ivaPercentage
        });

        concept.chargeWithoutIVA = new Decimal(chargeWithoutIVA);

        concept.charges = chargesResult;

        const {
            amount: amountWithSurcharges,
        } = getAmountAndTaxFromPriceWithIva({
            base: base.add(surcharges),
            ivaPercentage
        });

        concept.fiscalPrices.unitPrice = amountWithSurcharges.div(concept.quantity);

        const {
            amount: amountDiscounts,
        } = getAmountAndTaxFromPriceWithIva({
            base: discounts,
            ivaPercentage
        });

        concept.fiscalPrices.amount = amountWithSurcharges;
        amount = amount.add(concept.fiscalPrices.amount);

        concept.fiscalPrices.discount = amountDiscounts;
        discount = discount.add(concept.fiscalPrices.discount);

        concept.fiscalPrices.baseTax = amountWithSurcharges.sub(amountDiscounts);

        const {
            tax: taxTotal,
            amount: amountTotal,
        } = getAmountAndTaxFromPrice({
            base: concept.fiscalPrices.baseTax,
            ivaPercentage
        });

        concept.fiscalPrices.tax = taxTotal;

        concept.fiscalPrices.total = amountTotal;
    })

    const baseTax = amount.sub(discount);

    const {
        tax,
        amount: total
    } = getAmountAndTaxFromPrice({
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
    }
}

/**
 * Aplica cargos a un monto dado.
 * @param {Object} params - Parámetros de entrada para aplicar los cargos.
 * @returns {Object} - Resultado de la aplicación de cargos.
 * Ejemplo: applyCharges({ amount, charges, fountType })
 */
export const applyCharges = (params: ApplyChargesParams) => {
    const {amount, fountType} = params;

    let {charges} = params;

    let base = new Decimal(amount);
    let discounts = new Decimal(0);
    let surcharges = new Decimal(0);

    if (fountType === FountTypeEnum.DISCOUNT_ON_DISCOUNT) {
        const chargesSorted = charges.map((value, index) => ({
            ...value,
            order: value?.order || index
        })).sort((a, b) => a.order - b.order);

        let variantBase = new Decimal(amount)

        chargesSorted.forEach((charge: Charge) => {
            const {amount: chargeAmount} = calculateCharge({charge, base: variantBase});

            if (charge.type === ChargeTypeEnum.DISCOUNTS) {
                variantBase = new Decimal(variantBase.sub(chargeAmount));
                discounts = new Decimal(discounts.add(chargeAmount));
            }

            if (charge.type === ChargeTypeEnum.SURCHARGES) {
                variantBase = new Decimal(variantBase.add(chargeAmount));
                surcharges = new Decimal(surcharges.add(chargeAmount));
            }

            charge.chargeAmount = new Decimal(chargeAmount);
        });

        charges = chargesSorted;
    }

    if (fountType === FountTypeEnum.TRADITIONAL) {
        charges.forEach((charge: Charge) => {
            const {amount: chargeAmount} = calculateCharge({charge, base: new Decimal(amount)});

            if (charge.type === ChargeTypeEnum.DISCOUNTS) {
                discounts = new Decimal(discounts.add(chargeAmount));
            }

            if (charge.type === ChargeTypeEnum.SURCHARGES) {
                surcharges = new Decimal(surcharges.add(chargeAmount));
            }

            charge.chargeAmount = new Decimal(chargeAmount);
        });
    }

    return {
        base,
        discounts,
        surcharges,
        charges
    }
}

/**
 * Calcula un cargo en función de su tipo y aplicación.
 * @param {Object} params - Parámetros de entrada para calcular un cargo.
 * @returns {Object} - Resultado del cálculo del cargo.
 * Ejemplo: calculateCharge({ charge, base })
 */
export const calculateCharge = (params: CalculateChargeParams) => {
    const {charge: {amount, application, type}, base} = params;

    const x = createDecimal(base);

    const y = createDecimal(amount);

    let z = createDecimal(amount);

    if (application === ChargeApplicationEnum.PERCENTAGE) {
        z = x.mul(y).div(100);
    }

    switch (type) {
        case ChargeTypeEnum.DISCOUNTS:
            return {
                base: x,
                amount: z,
                applied: x.sub(z),
            }
        case ChargeTypeEnum.SURCHARGES:
            return {
                base: x,
                amount: z,
                applied: x.add(z),
            }
        default:
            return {
                base: x,
                amount: z,
                applied: x,
            }
    }
}

/**
 * Obtiene el monto de pago restando el cambio.
 * @param {Object} params - Parámetros de entrada para obtener el monto de pago.
 * @returns {Decimal} - Monto de pago calculado.
 * Ejemplo: getPaymentAmount({ amount, change })
 */
export const getPaymentAmount = (params: Payment): Decimal => {
    const {amount, change} = params;

    const x = createDecimal(amount);

    const y = createDecimal(change);

    return x.sub(y);
}

/**
 * Obtiene el monto y el impuesto de un precio con IVA.
 * @param {Object} params - Parámetros de entrada para obtener el monto y el impuesto.
 * @returns {Object} - Monto y impuesto calculados.
 * Ejemplo: getAmountAndTaxFromPriceWithIva({ base, ivaPercentage })
 */
export const getAmountAndTaxFromPriceWithIva = (params: AmountAndTaxParams) => {
    const base = createDecimal(params.base);

    const percentage = createDecimal(params.ivaPercentage).add(1);

    const amount = base.div(percentage);

    const tax = amount.mul(percentage);

    return {
        base,
        amount,
        tax
    }
}

/**
 * Obtiene el monto y el impuesto de un precio sin IVA.
 * @param {Object} params - Parámetros de entrada para obtener el monto y el impuesto.
 * @returns {Object} - Monto y impuesto calculados.
 * Ejemplo: getAmountAndTaxFromPriceWithIva({ base, ivaPercentage })
 */
export const getAmountAndTaxFromPrice = (params: AmountAndTaxParams) => {
    const base = createDecimal(params.base);

    const percentage = createDecimal(params.ivaPercentage);

    const tax = base.mul(percentage);

    const amount = base.add(tax);

    return {
        base,
        amount,
        tax
    }
}
