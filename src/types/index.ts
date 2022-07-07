import { Decimal } from 'decimal.js';

export enum TaxPercentageEnum {
    T0 = 0,
    T14 = 0.14,
    T16 = 0.16,
    T18 = 0.18
}

export type TaxPercentage = TaxPercentageEnum | number;

/*
* Tipo de cargo
*
* @TRADITIONAL - Cargos de forma tradicional
* @DISCOUNT_ON_DISCOUNT - Descuento sobre descuentos
* */

export enum FountTypeEnum {
    TRADITIONAL = 1,
    DISCOUNT_ON_DISCOUNT = 2,
}

/*
* Tipo de cargo
*
* @Discounts - Descuento
* @Surcharges - Cargos
* */
export enum ChargeTypeEnum {
    DISCOUNTS = 1,
    SURCHARGES = 2,
}

/*
* Tipo de aplicación
*
* @PERCENTAGE - Descuento
* @QUANTITY - Cargos
* */
export enum ChargeApplicationEnum {
    PERCENTAGE = 1,
    QUANTITY = 2,
}

/*
* Cargos - Cargos extra
*
* @amount - Cantidad
* @type - Tipo de cargo
* @application - Tipo de aplicación
* */
export type Charge = {
    id?: string | number;
    order?: number;
    chargeAmount?: Decimal;
    amount: number;
    type: ChargeTypeEnum;
    application: ChargeApplicationEnum;
}

/*
* Pago - Detalles del pago
*
* @change - Cambio
* @amount - Recibido
* */
export type Payment = {
    change: number;
    amount: number;
}

export type FiscalPrices = {
    discount?: Decimal;
    unitPrice?: Decimal;
    amount?: Decimal;
    baseTax?: Decimal;
    tax?: Decimal;
    total?: Decimal;
}

export type Prices = {
    quantity: Decimal | number;
    basePrice: Decimal | number;
    fiscalPrices?: FiscalPrices;
    amountWithoutCharges?: Decimal;
    amountWithCharges?: Decimal;
    discountWithIVA?: Decimal;
    discountWithoutIVA?: Decimal;
    chargeWithIVA?: Decimal;
    chargeWithoutIVA?: Decimal;
};

/*
* Concepto
*
* @id - Identificador único
* @name - Nombre descriptivo
* @price - Precio con IVA
* @quantity - Cantidad
* @charges - Cantidad
* */
export type Concept = {
    id: number | string;
    name: string;
    charges: Charge[];
} & Prices
/*
* Parámetros para calcular los precios en factura
*
* @payment - Detalles del pago;
* @concepts - Arreglo de conceptos con sus cargos
* @fountType - Tipo de cargos [Tradicional o Descuento sobre descuento]
* @ivaPercentage - Porcentaje de iva para aplicar - 0.16
* */
export type CalculateInvoicePricesParams = {
    payment: Payment;
    concepts: Concept[];
    fountType: FountTypeEnum;
    ivaPercentage: TaxPercentage;
}

export type ApplyPayment = {
    details: ConceptAmountDetailsResult;
    percentage: Decimal;
}

/*
* Calcular los detalles de los conceptos
*
* @concepts - Arreglo de conceptos con sus cargos
* @fountType - Tipo de cargos [Tradicional o Descuento sobre descuento]
* */
export type ConceptAmountDetailsParams = {
    concepts: Concept[];
    fountType: FountTypeEnum;
    ivaPercentage: TaxPercentage;
}

export type ConceptAmountDetailsResult = {
    concepts: Concept[];
} & FiscalPrices

export type ApplyChargesParams = {
    fountType: FountTypeEnum;
    charges: Charge[];
    amount: Decimal;
}

export type CalculateChargeParams = {
    base: Decimal;
    charge: Charge;
}

export type AmountAndTaxParams = {
    ivaPercentage: TaxPercentage;
    base: Decimal;
}
