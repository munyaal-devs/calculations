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
    price: number;
    charges: Charge[];
    quantity: Decimal | number,
    priceWithIva?: Decimal,
    discountsWithIva?: Decimal,
    discountsWithoutIva?: Decimal,
    priceWithoutIva?: Decimal,
    unitPrice?: Decimal,
    taxBase?: Decimal,
    tax?: Decimal,
    total?: Decimal,
}
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
    priceWithIva: Decimal;
    priceWithoutIva: Decimal;
    discountsWithIva: Decimal;
    discountsWithoutIva: Decimal;
    totalTaxBase: Decimal;
    totalTax: Decimal;
    total: Decimal;
}

export type ApplyChargesParams = {
    amount: number;
    charges: Charge[];
}

export type CalculateChargeParams = {
    base: number;
    charge: Charge;
}

export type AmountAndTaxParams = {
    ivaPercentage: TaxPercentage;
    base: number;
}
