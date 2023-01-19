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
    FountTypeEnum,
    Payment
} from '../types';

export const calculateInvoice = <T = any>(params: CalculateInvoiceParams) => {
    const {concepts, fountType, ivaPercentage} = params;

    return getConceptAmountDetails<T>({concepts, fountType, ivaPercentage})
}

export const calculateInvoicePrices = <T = any>(params: CalculateInvoicePricesParams) => {
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

export const applyPayment = <T = any>(params: ApplyPayment): ConceptAmountDetailsResult<T> => {
    const {percentage, details: detailsWithoutPayment, ivaPercentage} = params;

    const details = Object.assign({}, detailsWithoutPayment)

    const concepts: Concept<T>[] = [];

    let discount = new Decimal(0);
    let amount = new Decimal(0);

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

/*
* Obtiene los detalles de los conceptos
* */
export const getConceptAmountDetails = <T = any>(params: ConceptAmountDetailsParams): ConceptAmountDetailsResult<T> => {
    const {concepts, fountType, ivaPercentage} = params;

    let discount = new Decimal(0);
    let amount = new Decimal(0);

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

        concept.basePrice = new Decimal(new Decimal(concept.basePrice).toFixed(6));
        concept.quantity = new Decimal(new Decimal(concept.quantity).toFixed(6));

        concept.amountWithoutCharges = new Decimal(concept.basePrice.mul(concept.quantity).toFixed(6));

        const {discounts, surcharges, base, charges: chargesResult} = applyCharges({
            amount: concept.amountWithoutCharges,
            charges,
            fountType
        });

        concept.amountWithCharges = new Decimal(concept.amountWithoutCharges.add(surcharges).sub(discounts).toFixed(6));

        concept.discountWithIVA = new Decimal(discounts.toFixed(6));

        const {
            amount: discountWithoutIVA,
        } = getAmountAndTaxFromPriceWithIva({
            base: discounts,
            ivaPercentage
        });

        concept.discountWithoutIVA = new Decimal(discountWithoutIVA.toFixed(6));

        concept.chargeWithIVA = new Decimal(surcharges.toFixed(6));

        const {
            amount: chargeWithoutIVA,
        } = getAmountAndTaxFromPriceWithIva({
            base: surcharges,
            ivaPercentage
        });

        concept.chargeWithoutIVA = new Decimal(chargeWithoutIVA.toFixed(6));

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

/*
* Aplicar cargos
* */
export const applyCharges = (params: ApplyChargesParams) => {
    const {amount, fountType} = params;

    let {charges} = params;

    let base = new Decimal(amount.toFixed(6));
    let discounts = new Decimal(0);
    let surcharges = new Decimal(0);

    if (fountType === FountTypeEnum.DISCOUNT_ON_DISCOUNT) {
        const chargesSorted = charges.map((value, index) => ({
            ...value,
            order: value?.order || index
        })).sort((a, b) => a.order - b.order);

        let variantBase = new Decimal(amount.toFixed(6))

        chargesSorted.forEach((charge: Charge) => {
            const {amount: chargeAmount} = calculateCharge({charge, base: variantBase});

            if (charge.type === ChargeTypeEnum.DISCOUNTS) {
                variantBase = new Decimal(variantBase.sub(chargeAmount).toFixed(6));
                discounts = new Decimal(discounts.add(chargeAmount).toFixed(6));
            }

            if (charge.type === ChargeTypeEnum.SURCHARGES) {
                variantBase = new Decimal(variantBase.add(chargeAmount).toFixed(6));
                surcharges = new Decimal(surcharges.add(chargeAmount).toFixed(6));
            }

            charge.chargeAmount = new Decimal(chargeAmount.toFixed(6));
        });

        charges = chargesSorted;
    }

    if (fountType === FountTypeEnum.TRADITIONAL) {
        charges.forEach((charge: Charge) => {
            const {amount: chargeAmount} = calculateCharge({charge, base: new Decimal(amount.toFixed(6))});

            if (charge.type === ChargeTypeEnum.DISCOUNTS) {
                discounts = new Decimal(discounts.add(chargeAmount).toFixed(6));
            }

            if (charge.type === ChargeTypeEnum.SURCHARGES) {
                surcharges = new Decimal(surcharges.add(chargeAmount).toFixed(6));
            }

            charge.chargeAmount = new Decimal(chargeAmount.toFixed(6));
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

    const x = new Decimal(new Decimal(base).toFixed(6));

    const y = new Decimal(new Decimal(amount).toFixed(6));

    let z = new Decimal(new Decimal(amount).toFixed(6));

    if (application === ChargeApplicationEnum.PERCENTAGE) {
        z = new Decimal(x.mul(y).div(100).toFixed(6));
    }

    switch (type) {
        case ChargeTypeEnum.DISCOUNTS:
            return {
                base: new Decimal(x.toFixed(6)),
                amount: new Decimal(z.toFixed(6)),
                applied: new Decimal(x.sub(z).toFixed(6)),
            }
        case ChargeTypeEnum.SURCHARGES:
            return {
                base: new Decimal(x.toFixed(6)),
                amount: new Decimal(z.toFixed(6)),
                applied: new Decimal(x.add(z).toFixed(6)),
            }
        default:
            return {
                base: new Decimal(x.toFixed(6)),
                amount: new Decimal(z.toFixed(6)),
                applied: new Decimal(x.toFixed(6)),
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

    return new Decimal(x.sub(y).toFixed(6));
}

export const getAmountAndTaxFromPriceWithIva = (params: AmountAndTaxParams) => {
    const base = new Decimal(params.base.toFixed(6));

    const percentage = new Decimal(params.ivaPercentage).add(1);

    const amount = new Decimal(base.div(percentage).toFixed(6));

    const tax = new Decimal(amount.mul(percentage).toFixed(6));

    return {
        base,
        amount,
        tax
    }
}

export const getAmountAndTaxFromPrice = (params: AmountAndTaxParams) => {
    const base = new Decimal(params.base.toFixed(6));

    const percentage = new Decimal(params.ivaPercentage);

    const tax = new Decimal(base.mul(percentage).toFixed(6));

    const amount = new Decimal(base.mul(percentage.add(1)).toFixed(6));

    return {
        base,
        amount,
        tax
    }
}
