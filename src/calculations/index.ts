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

    const detailsWithoutPaymentApplied = getConceptAmountDetails({concepts, fountType, ivaPercentage})

    const paymentPercentage = paymentAmount.div(detailsWithoutPaymentApplied.total || 1);

    const detailsWithPaymentApplied = applyPayment({
        details: detailsWithoutPaymentApplied,
        percentage: paymentPercentage
    })

    return {
        detailsWithPaymentApplied,
        detailsWithoutPaymentApplied,
    };
}

export const applyPayment = (params: ApplyPayment): ConceptAmountDetailsResult => {
    const {percentage, details: {concepts}} = params;

    let discount = new Decimal(0);
    let amount = new Decimal(0);
    let baseTax = new Decimal(0);
    let tax = new Decimal(0);
    let total = new Decimal(0);

    concepts.forEach((concept: Concept) => {
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
        if (concept.fiscalPrices?.tax) {
            concept.fiscalPrices.tax = concept.fiscalPrices?.tax?.mul(percentage);
            tax = tax.add(concept.fiscalPrices.tax);
        }

        if (concept.fiscalPrices?.total) {
            concept.fiscalPrices.total = concept.fiscalPrices?.total?.mul(percentage);
            total = total.add(concept.fiscalPrices.total);
        }

        if (concept.fiscalPrices?.baseTax) {
            concept.fiscalPrices.baseTax = concept.fiscalPrices?.baseTax?.mul(percentage);
            baseTax = baseTax.add(concept.fiscalPrices.baseTax);
        }

        if (concept.fiscalPrices?.total) {
            concept.fiscalPrices.total = concept.fiscalPrices?.total?.mul(percentage);
            total = total.add(concept.fiscalPrices.total);
        }

        if (concept.fiscalPrices?.amount) {
            concept.fiscalPrices.amount = concept.fiscalPrices?.amount?.mul(percentage);
            amount = amount.add(concept.fiscalPrices.amount);
        }
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

/*
* Obtiene los detalles de los conceptos
* */
export const getConceptAmountDetails = (params: ConceptAmountDetailsParams): ConceptAmountDetailsResult => {
    const {concepts, fountType, ivaPercentage} = params;

    let discount = new Decimal(0);
    let amount = new Decimal(0);
    let baseTax = new Decimal(0);
    let tax = new Decimal(0);
    let total = new Decimal(0);

    concepts.forEach((concept: Concept) => {
        concept.fiscalPrices = {
            unitPrice: new Decimal(0),
            baseTax: new Decimal(0),
            tax: new Decimal(0),
            amount: new Decimal(0),
            total: new Decimal(0),
            discount: new Decimal(0),
        };

        const charges = concept.charges.sort((a, b) => a.type - b.type);

        concept.basePrice = new Decimal(concept.basePrice);
        concept.quantity = new Decimal(concept.quantity);

        concept.amountWithoutCharges = concept.basePrice.mul(concept.quantity);

        const {discounts, surcharges, base, charges: chargesResult} = applyCharges({
            amount: concept.amountWithoutCharges,
            charges,
            fountType
        });

        concept.amountWithCharges = concept.amountWithoutCharges.add(surcharges).sub(discounts);

        concept.discountWithIVA = discount;

        const {
            amount: discountWithoutIVA,
        } = getAmountAndTaxFromPriceWithIva({
            base: discount,
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

        concept.chargeWithoutIVA = chargeWithoutIVA;

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

        concept.fiscalPrices.baseTax = amountWithSurcharges.sub(amountDiscounts);
        baseTax = baseTax.add(concept.fiscalPrices.baseTax)

        const {
            tax: taxTotal,
            amount: amountTotal,
        } = getAmountAndTaxFromPrice({
            base: concept.fiscalPrices.baseTax,
            ivaPercentage
        });

        concept.fiscalPrices.amount = amountWithSurcharges;
        amount = amount.add(concept.fiscalPrices.amount);

        concept.fiscalPrices.discount = amountDiscounts;
        discount = discount.add(concept.fiscalPrices.discount);

        concept.fiscalPrices.tax = taxTotal;
        tax = tax.add(concept.fiscalPrices.tax);

        concept.fiscalPrices.total = amountTotal;
        total = total.add(concept.fiscalPrices.total);
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
            const {amount: chargeAmount} = calculateCharge({charge, base: variantBase});

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
    const {base} = params

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
