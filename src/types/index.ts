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
export type Charge<T = any> = {
    id?: string | number;
    order?: number;
    chargeAmount?: Decimal;
    amount: number;
    type: ChargeTypeEnum;
    application: ChargeApplicationEnum;
    data?: T;
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
export type Concept<T = any> = Prices & {
    id: number | string;
    name: string;
    charges: Charge[];
    data?: T;
}

/*
* Parámetros para calcular los precios en factura
*
* @payment - Detalles del pago;
* @concepts - Arreglo de conceptos con sus cargos
* @fountType - Tipo de cargos [Tradicional o Descuento sobre descuento]
* @ivaPercentage - Porcentaje de iva para aplicar - 0.16
* */
export type CalculateInvoiceParams<T = any> = {
    concepts: Concept<T>[];
    fountType: FountTypeEnum;
    ivaPercentage: TaxPercentage;
}

/*
* Parámetros para calcular los precios en factura
*
* @payment - Detalles del pago;
* @concepts - Arreglo de conceptos con sus cargos
* @fountType - Tipo de cargos [Tradicional o Descuento sobre descuento]
* @ivaPercentage - Porcentaje de iva para aplicar - 0.16
* */
export type CalculateInvoicePricesParams<T = any> = {
    payment: Payment;
    concepts: Concept<T>[];
    fountType: FountTypeEnum;
    ivaPercentage: TaxPercentage;
}

export type ApplyPayment<T = any> = {
    details: ConceptAmountDetailsResult<T>;
    percentage: Decimal;
    ivaPercentage: TaxPercentage;
}

/*
* Calcular los detalles de los conceptos
*
* @concepts - Arreglo de conceptos con sus cargos
* @fountType - Tipo de cargos [Tradicional o Descuento sobre descuento]
* */
export type ConceptAmountDetailsParams<T = any> = {
    concepts: Concept<T>[];
    fountType: FountTypeEnum;
    ivaPercentage: TaxPercentage;
}

export type ConceptAmountDetailsResult<T = any> = {
    concepts: Concept<T>[];
} & FiscalPrices

export type ApplyChargesParams<T = any> = {
    fountType: FountTypeEnum;
    charges: Charge<T>[];
    amount: Decimal;
}

export type CalculateChargeParams<T = any> = {
    base: Decimal;
    charge: Charge<T>;
}

export type AmountAndTaxParams = {
    ivaPercentage: TaxPercentage;
    base: Decimal;
}
