import { Decimal } from 'decimal.js';

import {
    AmountAndTaxParams,
    ApplyChargesParams,
    ApplyPayment,
    CalculateChargeParams,
    CalculateInvoicePricesParams,
    Charge,
    ChargeApplicationEnum,
    ChargeTypeEnum,
    Concept,
    ConceptAmountDetailsParams,
    ConceptAmountDetailsResult,
    FountTypeEnum,
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

    let priceWithIva = new Decimal(0.00);
    let priceWithoutIva = new Decimal(0.00);
    let discountsWithIva = new Decimal(0.00);
    let discountsWithoutIva = new Decimal(0.00);
    let totalTaxBase = new Decimal(0.00);
    let totalTax = new Decimal(0.00);
    let total = new Decimal(0.00);

    concepts.forEach((concept) => {
        if (concept.priceWithIva) {
            concept.priceWithIva = concept.priceWithIva?.mul(percentage);
            priceWithIva = priceWithIva.add(concept.priceWithIva);
        }

        if (concept.discountsWithIva) {
            concept.discountsWithIva = concept.discountsWithIva?.mul(percentage);
            discountsWithIva = discountsWithIva.add(concept.discountsWithIva);
        }

        if (concept.discountsWithoutIva) {
            concept.discountsWithoutIva = concept.discountsWithoutIva?.mul(percentage);
            discountsWithoutIva = discountsWithoutIva.add(concept.discountsWithoutIva);
        }

        if (concept.priceWithoutIva) {
            concept.priceWithoutIva = concept.priceWithoutIva?.mul(percentage);
            priceWithoutIva = priceWithoutIva.add(concept.priceWithoutIva);
        }

        if (concept.unitPrice) {
            concept.unitPrice = concept.unitPrice?.mul(percentage);
        }

        if (concept.taxBase) {
            concept.taxBase = concept.taxBase?.mul(percentage);
            totalTaxBase = totalTaxBase.add(concept.taxBase);
        }

        if (concept.tax) {
            concept.tax = concept.tax?.mul(percentage);
            totalTax = totalTax.add(concept.tax);
        }

        if (concept.total) {
            concept.total = concept.total?.mul(percentage);
            total = total.add(concept.total);
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

    let priceWithIva = new Decimal(0.00);
    let priceWithoutIva = new Decimal(0.00);
    let discountsWithIva = new Decimal(0.00);
    let discountsWithoutIva = new Decimal(0.00);
    let totalTaxBase = new Decimal(0.00);
    let totalTax = new Decimal(0.00);
    let total = new Decimal(0.00);

    concepts.forEach((concept: Concept) => {
        const charges = concept.charges.sort((a, b) => a.type - b.type);

        concept.price = new Decimal(concept.price);
        concept.quantity = new Decimal(concept.quantity);

        const amount = concept.price.mul(concept.quantity).toNumber();

        const {discounts, surcharges, base, charges: chargesResult } = applyCharges({
            amount,
            charges,
            fountType
        });

        concept.charges = chargesResult;

        const {
            amount: amountWithSurcharges,
            base: baseWithSurcharges,
        } = getAmountAndTaxFromPriceWithIva({
            base: base.add(surcharges).toNumber(),
            ivaPercentage
        })

        const unitPrice = amountWithSurcharges.div(concept.quantity);

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

        concept.priceWithIva = baseWithSurcharges;
        priceWithIva = priceWithIva.add(baseWithSurcharges)

        concept.discountsWithIva = baseDiscounts;
        discountsWithIva = discountsWithIva.add(baseDiscounts);

        concept.discountsWithoutIva = amountDiscounts;
        discountsWithoutIva = discountsWithoutIva.add(amountDiscounts);

        concept.priceWithoutIva = amountWithSurcharges;
        priceWithoutIva = priceWithoutIva.add(amountWithSurcharges);

        concept.unitPrice = unitPrice;

        concept.taxBase = taxBase;
        totalTaxBase = totalTaxBase.add(taxBase);

        concept.tax = taxTotal;
        totalTax = totalTax.add(taxTotal);

        concept.total = amountTotal;
        total = total.add(amountTotal);

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
* Aplicar cargos
* */
export const applyCharges = (params: ApplyChargesParams) => {
    const {amount, fountType} = params;

    let {charges} = params

    let base = new Decimal(amount);
    let discounts = new Decimal(0);
    let surcharges = new Decimal(0);

    if (fountType === FountTypeEnum.DISCOUNT_ON_DISCOUNT) {
        const chargesSorted = charges.map((value, index) => ({
            ...value,
            order: value?.order || index
        })).sort((a, b) => a.order - b.order);

        // BASE = 1000
        let variantBase = new Decimal(amount)

        chargesSorted.forEach((charge: Charge) => {
            // CHARGE = 50
            const {amount: chargeAmount} = calculateCharge({charge, base: variantBase.toNumber()});

            if (charge.type === ChargeTypeEnum.DISCOUNTS) {
                variantBase = variantBase.sub(chargeAmount);
                discounts = discounts.add(chargeAmount);
            }

            if (charge.type === ChargeTypeEnum.SURCHARGES) {
                variantBase = variantBase.add(chargeAmount);
                surcharges = surcharges.add(chargeAmount);
            }

            charge.chargeAmount = chargeAmount;
        });

        charges = chargesSorted;
    }

    if (fountType === FountTypeEnum.TRADITIONAL) {
        charges.forEach((charge: Charge) => {
            const {amount: chargeAmount} = calculateCharge({charge, base: amount});

            if (charge.type === ChargeTypeEnum.DISCOUNTS) {
                discounts = discounts.add(chargeAmount);
            }

            if (charge.type === ChargeTypeEnum.SURCHARGES) {
                surcharges = surcharges.add(chargeAmount);
            }

            charge.chargeAmount = chargeAmount;
        });
    }

    return {
        base,
        discounts,
        surcharges,
        charges
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
