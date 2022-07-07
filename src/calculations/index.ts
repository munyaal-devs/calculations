import { Decimal } from 'decimal.js';

import {
    AmountAndTaxParams,
    ApplyChargesParams, ApplyPayment,
    CalculateChargeParams,
    CalculateInvoicePricesParams,
    Charge,
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    ConceptAmountDetailsParams, ConceptAmountDetailsResult,
    Payment
} from '../types';

export const calculateInvoicePrices = (params: CalculateInvoicePricesParams) => {
    const {payment, concepts, fountType, ivaPercentage} = params;

    const paymentAmount = getPaymentAmount(payment);

    const generalDetails = getConceptAmountDetails({concepts, fountType, ivaPercentage})

    const paymentPercentage = paymentAmount.div(generalDetails.total);

    return applyPayment({
        details: generalDetails,
        percentage: paymentPercentage
    });

}

export const applyPayment = (params: ApplyPayment): ConceptAmountDetailsResult => {
    const {percentage, details: {concepts}} = params;

    let priceWithIva = new Decimal(0);
    let priceWithoutIva = new Decimal(0);
    let discountsWithIva = new Decimal(0);
    let discountsWithoutIva = new Decimal(0);
    let totalTaxBase = new Decimal(0);
    let totalTax = new Decimal(0);
    let total = new Decimal(0);

    concepts.forEach((concept) => {
        if (concept.priceWithIva) {
            priceWithIva = new Decimal(priceWithIva.add(concept.priceWithIva?.mul(percentage)).toFixed(2));

            concept.priceWithIva = new Decimal(concept.priceWithIva?.mul(percentage).toFixed(2));
        }

        if (concept.discountsWithIva) {
            discountsWithIva = new Decimal(discountsWithIva.add(concept.discountsWithIva?.mul(percentage)).toFixed(2));

            concept.discountsWithIva = new Decimal(concept.discountsWithIva?.mul(percentage).toFixed(2));
        }

        if (concept.discountsWithoutIva) {
            discountsWithoutIva = new Decimal(discountsWithoutIva.add(concept.discountsWithoutIva?.mul(percentage)).toFixed(2));

            concept.discountsWithoutIva = new Decimal(concept.discountsWithoutIva?.mul(percentage).toFixed(2));
        }

        if (concept.priceWithoutIva) {
            priceWithoutIva = new Decimal(priceWithoutIva.add(concept.priceWithoutIva?.mul(percentage)).toFixed(2));

            concept.priceWithoutIva = new Decimal(concept.priceWithoutIva?.mul(percentage).toFixed(2));
        }

        if (concept.unitPrice) {
            concept.unitPrice = new Decimal(concept.unitPrice?.mul(percentage).toFixed(2));
        }

        if (concept.taxBase) {
            totalTaxBase = new Decimal(totalTaxBase.add(concept.taxBase?.mul(percentage)).toFixed(2))

            concept.taxBase = new Decimal(concept.taxBase?.mul(percentage).toFixed(2));
        }

        if (concept.tax) {
            totalTax = new Decimal(totalTax.add(concept.tax?.mul(percentage)).toFixed(2));

            concept.tax = new Decimal(concept.tax?.mul(percentage).toFixed(2));
        }

        if (concept.total) {
            total = new Decimal(total.add(concept.total?.mul(percentage)).toFixed(2));

            concept.total = new Decimal(concept.total?.mul(percentage).toFixed(2));
        }
    });

    return {
        concepts,
        priceWithIva,
        priceWithoutIva,
        discountsWithIva,
        discountsWithoutIva,
        totalTaxBase,
        totalTax,
        total,
    }
}

/*
* Obtiene los detalles de los conceptos
* */
export const getConceptAmountDetails = (params: ConceptAmountDetailsParams): ConceptAmountDetailsResult => {
    const {concepts, fountType, ivaPercentage} = params;

    let priceWithIva = new Decimal(0);
    let priceWithoutIva = new Decimal(0);
    let discountsWithIva = new Decimal(0);
    let discountsWithoutIva = new Decimal(0);
    let totalTaxBase = new Decimal(0);
    let totalTax = new Decimal(0);
    let total = new Decimal(0);

    concepts.forEach((concept: Concept) => {
        const charges = concept.charges.sort((a, b) => a.type - b.type);

        const quantity = new Decimal(concept.quantity);

        const price = new Decimal(concept.price);

        const amount = price.mul(quantity).toNumber();

        const {discounts, surcharges, base} = applyCharges({
            amount,
            charges
        });

        const {
            amount: amountWithSurcharges,
            base: baseWithSurcharges,
        } = getAmountAndTaxFromPriceWithIva({
            base: base.add(surcharges).toNumber(),
            ivaPercentage
        })

        const unitPrice = amountWithSurcharges.div(quantity);

        const {
            amount: amountDiscounts,
            base: baseDiscounts,
        } = getAmountAndTaxFromPriceWithIva({
            base: discounts.toNumber(),
            ivaPercentage
        });

        const taxBase = amountWithSurcharges.sub(amountDiscounts);

        const {
            tax: taxTotal,
            amount: amountTotal,
        } = getAmountAndTaxFromPrice({
            base: taxBase.toNumber(),
            ivaPercentage
        });

        priceWithIva = new Decimal(priceWithIva.add(baseWithSurcharges))
        concept.priceWithIva = new Decimal(baseWithSurcharges.toFixed(2));

        discountsWithIva = new Decimal(discountsWithIva.add(baseDiscounts));
        concept.discountsWithIva = new Decimal(baseDiscounts.toFixed(2));

        concept.quantity = new Decimal(quantity.toFixed(2));

        discountsWithoutIva = new Decimal(discountsWithoutIva.add(amountDiscounts));
        concept.discountsWithoutIva = new Decimal(amountDiscounts.toFixed(2));

        priceWithoutIva = new Decimal(priceWithoutIva.add(amountWithSurcharges));
        concept.priceWithoutIva = new Decimal(amountWithSurcharges.toFixed(2));

        concept.unitPrice = new Decimal(unitPrice.toFixed(2));

        totalTaxBase = new Decimal(totalTaxBase.add(taxBase));
        concept.taxBase = new Decimal(taxBase.toFixed(2));

        totalTax = new Decimal(totalTax.add(taxTotal));
        concept.tax = new Decimal(taxTotal.toFixed(2));

        total = new Decimal(total.add(amountTotal));
        concept.total = new Decimal(amountTotal.toFixed(2));

    });

    return {
        concepts,
        priceWithIva: new Decimal(priceWithIva.toFixed(2)),
        priceWithoutIva: new Decimal(priceWithoutIva.toFixed(2)),
        discountsWithIva: new Decimal(discountsWithIva.toFixed(2)),
        discountsWithoutIva: new Decimal(discountsWithoutIva.toFixed(2)),
        totalTaxBase: new Decimal(totalTaxBase.toFixed(2)),
        totalTax: new Decimal(totalTax.toFixed(2)),
        total: new Decimal(total.toFixed(2)),
    }
}

/*
* Aplicar cargos
* */
export const applyCharges = (params: ApplyChargesParams) => {
    const {charges, amount} = params;

    let base = new Decimal(amount);
    let discounts = new Decimal(0);
    let surcharges = new Decimal(0);

    charges.forEach((charge: Charge) => {
        const {amount: chargeAmount} = calculateCharge({charge, base: amount});

        if (charge.type === ChargeTypeEnum.DISCOUNTS) {
            discounts = discounts.add(chargeAmount)
        }

        if (charge.type === ChargeTypeEnum.SURCHARGES) {
            surcharges = surcharges.add(chargeAmount)
        }
    });

    return {
        base,
        discounts,
        surcharges,
    }
}

/*
* Calcular el cargo
* */
export const calculateCharge = (params: CalculateChargeParams) => {
    const {charge: {amount, application, type}, base} = params;

    const x = new Decimal(base);

    const y = new Decimal(amount);

    let z = new Decimal(amount);

    if (application === ChargeApplicationEnum.PERCENTAGE) {
        z = x.mul(y).div(100);
    }

    switch (type) {
        case ChargeTypeEnum.DISCOUNTS:
            return {
                base: x.toNumber(),
                amount: z.toNumber(),
                applied: x.sub(z).toNumber(),
            }
        case ChargeTypeEnum.SURCHARGES:
            return {
                base: x.toNumber(),
                amount: z.toNumber(),
                applied: x.add(z).toNumber(),
            }
        default:
            return {
                base: x.toNumber(),
                amount: z.toNumber(),
                applied: x.toNumber(),
            }
    }
}

/*
* Obtiene el monto del pago
* */
export const getPaymentAmount = (params: Payment): Decimal => {
    const {amount, change} = params;

    const x = new Decimal(amount);

    const y = new Decimal(change);

    return x.sub(y);
}

export const getAmountAndTaxFromPriceWithIva = (params: AmountAndTaxParams) => {
    const base = new Decimal(params.base);

    const percentage = new Decimal(params.ivaPercentage).add(1);

    const amount = base.div(percentage);

    const tax = amount.mul(percentage);

    return {
        base,
        amount,
        tax
    }
}


export const getAmountAndTaxFromPrice = (params: AmountAndTaxParams) => {
    const base = new Decimal(params.base);

    const percentage = new Decimal(params.ivaPercentage);

    const tax = base.mul(percentage);

    const amount = base.mul(percentage.add(1));


    return {
        base,
        amount,
        tax
    }
}
