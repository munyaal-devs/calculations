import { Decimal } from 'decimal.js';

/**
 * Configuración de la precisión decimal por defecto.
 */
export const DecimalDefaultPrecision = 15;

// Configuración de la precisión decimal por defecto
Decimal.set({precision: DecimalDefaultPrecision});

/**
 * Enumeración de porcentajes de impuestos.
 */
export enum TaxPercentageEnum {
    /**
     * No hay impuestos (0%).
     */
    T0 = 0,

    /**
     * Impuesto del 14%.
     */
    T14 = 0.14,

    /**
     * Impuesto del 16%.
     */
    T16 = 0.16,

    /**
     * Impuesto del 18%.
     */
    T18 = 0.18
}

/**
 * Tipo para porcentaje de impuestos.
 */
export type TaxPercentage = TaxPercentageEnum | number;

/**
 * Enumeración de tipos de aplicación de cargos.
 */
export enum FountTypeEnum {
    /**
     * Los cargos se calculan sobre el precio total original en cada paso sin considerar cargos previos.
     * */
    TRADITIONAL = 1,

    /**
     * Cada cargo se calcula y aplica al precio total, reduciendo la base para el próximo cálculo. Los cargos se aplican secuencialmente sobre la base ajustada.
     * */
    DISCOUNT_ON_DISCOUNT = 2,
}

/**
 * Enumeración de tipos de cargo.
 */
export enum ChargeTypeEnum {
    /**
     * Descuento
     */
    DISCOUNTS = 1,

    /**
     * Cargo
     */
    SURCHARGES = 2,
}

/**
 * Enumeración de tipos de aplicación de cargo.
 */
export enum ChargeApplicationEnum {
    /**
     * Porcentaje
     */
    PERCENTAGE = 1,

    /**
     * Cantidad
     */
    QUANTITY = 2,
}

/**
 * Tipo para representar un cargo extra.
 */
export type Charge<T = any> = {
    /**
     * Identificador único
     */
    id?: string | number;

    /**
     * Orden del cargo
     * Se recomienda usar cuando se use 'ChargeTypeEnum SURCHARGES'
     */
    order?: number;

    /**
     * Cantidad del cargo
     */
    chargeAmount?: Decimal;

    /**
     * Cantidad del cargo
     */
    amount: number;

    /**
     * Tipo de cargo
     */
    type: ChargeTypeEnum;

    /**
     * Tipo de aplicación
     */
    application: ChargeApplicationEnum;

    /**
     * Datos adicionales
     */
    data?: T;
}

/**
 * Tipo para detalles de pago.
 */
export type Payment = {
    /**
     * Cambio
     */
    change: number;

    /**
     * Monto recibido
     */
    amount: number;
}

/**
 * Tipo para detalles fiscales.
 */
export type FiscalPrices = {
    /**
     * Descuento
     */
    discount?: Decimal;

    /**
     * Precio unitario
     */
    unitPrice?: Decimal;

    /**
     * Cantidad
     */
    amount?: Decimal;

    /**
     * Base de impuesto
     */
    baseTax?: Decimal;

    /**
     * Impuesto
     */
    tax?: Decimal;

    /**
     * Total
     */
    total?: Decimal;
}

/**
 * Tipo para precios.
 */
export type Prices = {
    /**
     * Cantidad.
     */
    quantity: Decimal | number;

    /**
     * Precio base.
     */
    basePrice: Decimal | number;

    /**
     * Detalles fiscales.
     */
    fiscalPrices?: FiscalPrices;

    /**
     * Cantidad sin cargos.
     */
    amountWithoutCharges?: Decimal;

    /**
     * Cantidad con cargos.
     */
    amountWithCharges?: Decimal;

    /**
     * Descuento con IVA.
     */
    discountWithIVA?: Decimal;

    /**
     * Descuento sin IVA.
     */
    discountWithoutIVA?: Decimal;

    /**
     * Cargo con IVA.
     */
    chargeWithIVA?: Decimal;

    /**
     * Cargo sin IVA.
     */
    chargeWithoutIVA?: Decimal;
};

/**
 * Tipo para representar un concepto.
 */
export type Concept<T = any> = Prices & {
    /**
     * Identificador único.
     */
    id: number | string;

    /**
     * Nombre descriptivo.
     */
    name: string;

    /**
     * Cargos (opcional).
     */
    charges?: Charge[];

    /**
     * Datos adicionales.
     */
    data?: T;
}

/**
 * Parámetros para calcular una factura.
 */
export type CalculateInvoiceParams<T = any, R = any> = {
    /**
     * Arreglo de conceptos con sus cargos
     */
    concepts: Concept<T>[];

    /**
     * Tipo de cargos [Tradicional o Descuento sobre descuento]
     */
    fountType: FountTypeEnum;

    /**
     * Porcentaje de IVA para aplicar
     */
    ivaPercentage: TaxPercentage;

    /**
    * Arreglo de cargos que aplican sobre la venta en general (opcional)
    * */
    charges?: Charge<R>[];
}

/**
 * Parámetros para calcular los precios de una factura.
 */
export type CalculateInvoicePricesParams<T = any> = {
    /**
     * Detalles del pago
     */
    payment: Payment;

    /**
     * Arreglo de conceptos con sus cargos
     */
    concepts: Concept<T>[];

    /**
     * Tipo de cargos [Tradicional o Descuento sobre descuento]
     */
    fountType: FountTypeEnum;

    /**
     * Porcentaje de IVA para aplicar
     */
    ivaPercentage: TaxPercentage;
}

/**
 * Tipo para aplicar un pago.
 */
export type ApplyPayment<T = any> = {
    /**
     * Detalles de los conceptos
     */
    details: ConceptAmountDetailsResult<T>;

    /**
     * Porcentaje de pago
     */
    percentage: Decimal;

    /**
     * Porcentaje de IVA para aplicar
     */
    ivaPercentage: TaxPercentage;
}

/**
 * Parámetros para calcular los detalles de los conceptos.
 */
export type ConceptAmountDetailsParams<T = any, R = any> = {
    /**
     * Arreglo de conceptos con sus cargos
     */
    concepts: Concept<T>[];

    /**
     * Tipo de cargos [Tradicional o Descuento sobre descuento]
     */
    fountType: FountTypeEnum;

    /**
     * Porcentaje de IVA para aplicar
     */
    ivaPercentage: TaxPercentage;

    /**
    * Arreglo de cargos que aplican en la venta (opcional)
    * */
    charges?: Charge<R>[];
}

/**
 * Resultado de calcular los detalles de los conceptos.
 */
export type ConceptAmountDetailsResult<T = any, R = any> = {
    /**
     * Arreglo de conceptos con sus cargos
     */
    concepts: Concept<T>[];

    /**
    * Arreglo de cargos en la venta (opcional)
    * */
    charges?: Charge<R>[];
} & FiscalPrices

/**
 * Parámetros para aplicar cargos.
 */
export type ApplyChargesParams<T = any> = {
    /**
     * Tipo de cargos [Tradicional o Descuento sobre descuento]
     */
    fountType: FountTypeEnum;

    /**
     * Cargos
     */
    charges?: Charge<T>[];

    /**
     * Cantidad
     */
    amount: Decimal;
}

/**
 * Parámetros para calcular un cargo.
 */
export type CalculateChargeParams<T = any> = {
    /**
     * Cantidad base
     */
    base: Decimal;

    /**
     * Cargo
     */
    charge: Charge<T>;
}

/**
 * Parámetros para obtener el monto y el impuesto.
 */
export type AmountAndTaxParams = {
    /**
     * Porcentaje de IVA
     */
    ivaPercentage: TaxPercentage;

    /**
     * Cantidad base
     */
    base: Decimal;
}
