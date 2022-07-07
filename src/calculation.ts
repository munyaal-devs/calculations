// import {Decimal} from 'decimal.js';
//
// Decimal.set({ precision: 2 });
//
// const initDecimal = new Decimal(0.00)
//
// export const ConceptsPriceByPaymentBilligCalculation = <T extends Detalles>(payload: {
//     payment: Payment,
//     details: T[]
//     type: InvoiceModules;
//     ivaDefault?: number;
//     ivaByDetail?: number;
//     typeConcept: 'Recepit' | 'Invoice'
//     baseDefault?: number;
// }): DataInvoice => {
//     const { payment, details, type, typeConcept, ivaDefault = 1.16, ivaByDetail = .16, baseDefault = 0 } = payload;
//     const pago = payment.quantity - payment.change;
//     //INICIALIZACION DEL OBJ RETORNO
//     let obj: DataInvoice = dataInvoiceInit;
//     //DATOS PARA SACAR EL PORCENTAJE DEL PAGO SOBRE EL TOTAL
//     const datapercentage = getDataPercentage({details, type});
//     //SE OBTIENE EL PORCENTAJE
//     const percentage = getPercentage({
//         totalConcept: Decimal.sum(...datapercentage.totalConcept),
//         becas: Decimal.sum(...datapercentage.becas),
//         recargos: Decimal.sum(...datapercentage.recargos),
//         discount: Decimal.sum(...datapercentage.discount),
//         pago});
//
//     // VALIDACION PARA RETORNAR CONCEPTOS ESPECIFICOS
//     let cptArray: any[] = []
//     // SE RECORREN LOS DETALLES PARA GENERAR LOS CONCEPTOS Y OBTENER LOS TOTALES
//     let SubTotal: Decimal[] = [];
//     let Descuento: Decimal[] = [];
//     let Total: Decimal[] = [];
//     let Recargo: Decimal[] = [];
//     let Impuesto: Decimal[] = [];
//     let base: Decimal[] = [];
//     let iva: Decimal[] = [];
//     details.forEach(concept=>{
//         // SE OBTIENE LOS CALCULOS
//         const totals = TotalWithPercentage({
//             obj: getCharges({ concept, type, iva: ivaDefault, priceConcept: getPrice(concept, type) }),
//             percentage
//         })
//         let cpt = {} as any;
//         if(typeConcept == "Recepit"){
//             cpt = {
//                 cantidad: totals.quantity.toFixed(2),
//                 descripcion: concept.descrption,
//                 descuento: totals.amountDiscount.toFixed(2),
//                 importe: totals.price.amount.toFixed(2),
//                 preciou: totals.price.priceUnit.toFixed(2),
//                 recargo: totals.data.recargos.toFixed(2)
//             } as ConceptReceipt;
//             if(type != InvoiceModules.STORE){
//                 cpt = {...cpt, beca: totals.data.becas.toFixed(2) } as ConceptSchoolAndAcademy
//             }
//         }else{
//             const details = getMoreDatails({ detail: concept, type })
//             cpt = {
//                 concept: {
//                 ClaveProdServ: details.claveProd,
//                 NoIdentificacion: `1`,
//                 Cantidad: concept.quantity,
//                 ClaveUnidad: details?.ClaveUnidad || 'E48',
//                 Descripcion: sanitizeStringToXml(details.descrption),
//                 ValorUnitario: parseFloat(totals.price.priceUnit.toString()).toFixed(3),
//                 Importe: parseFloat(totals.price.amount.toString()).toFixed(3),
//                 Descuento: parseFloat(totals.amountDiscount.toString()).toFixed(2),
//                 ObjetoImp: concept.objetoImp || ObjetoImpEnum.NoobjetoDeimpuesto
//                 },
//                 base: '',
//                 import: ''
//             };
//             if (ivaByDetail !== 0 && concept.objetoImp === ObjetoImpEnum.SíObjetoDeImpuesto) {
//                 cpt.base = parseFloat(totals.base.toString()).toFixed(2);
//                 cpt.import = parseFloat(totals.iva.toString()).toFixed(2);
//             }
//         }
//         cptArray.push(cpt)
//         SubTotal.push(totals.subtotal)
//         Descuento.push(totals.amountDiscount)
//         Total.push(totals.total)
//         Recargo.push(totals.data.recargos)
//         Impuesto.push(totals.iva)
//         base.push(totals.base)
//         iva.push(totals.iva)
//     });
//
//     if(typeConcept == "Recepit"){
//         if(type == InvoiceModules.STORE){
//             obj.concepts.conceptsMiniStore = cptArray
//         }else {
//             obj.concepts.conceptsSchoolAndAcademy = cptArray
//         }
//     }else{
//         obj.concepts.conceptsInvoice = cptArray;
//     }
//     obj.taxes = {
//         base: Decimal.sum(...base).toFixed(2),
//         amount: Decimal.sum(...iva).toFixed(2),
//     }
//     obj.totals.fiscal = {
//         SubTotal: Decimal.sum(...SubTotal).toFixed(2),
//         Descuento: Decimal.sum(...Descuento).toFixed(2),
//         Total: Decimal.sum(...Total).toFixed(2),
//     }
//     obj.totals.receipt = {
//         SubTotal: Decimal.sum(...SubTotal).toFixed(2),
//         Descuento: Decimal.sum(...Descuento).toFixed(2),
//         Total: Decimal.sum(...Total).toFixed(2),
//         Recargo: Decimal.sum(...Recargo).toFixed(2),
//         Impuesto: Decimal.sum(...Impuesto).toFixed(2),
//     }
//     return obj
//
// }
//
// const getCharges = <D extends Detalles>(payload: {
//     concept: D,
//     type: InvoiceModules,
//     iva: number;
//     priceConcept: number;
// }) => {
//     // DESCUENTO SOBRE DESCUENTO MODULO ACADEMIAS
//     const { concept, type, iva, priceConcept, } = payload
//     const { extraCharges = [] } = concept
//     let obj: ChargesDetails = {...initChargesDetails, quantity: new Decimal(concept.quantity)};
//     let priceWithoutIva = initDecimal;
//     obj.data = getTotalExtraCharge(extraCharges, priceConcept, type);
//     console.log(obj.data)
//     switch (type) {
//         case 1:
//             //ACADEMIA DESCUENTO SOBRE DESCUENTO
//             obj.amountDiscount = Decimal.div(Decimal.mul(concept.quantity, obj.data.discount), iva);
//             break;
//         default:
//             // TIENDA Y COLEGIO DESCUENTOS NORMALES
//             obj.amountDiscount = Decimal.div(Decimal.mul(concept.quantity, Decimal.add(obj.data.discount, obj.data.becas)), iva);
//             break;
//     }
//     priceWithoutIva = Decimal.div(Decimal.mul(Decimal.add(priceConcept, obj.data.recargos), concept.quantity), iva);
//     obj.price.priceUnit = Decimal.div(
//         //precio sin iva
//         priceWithoutIva,
//         //cantidad
//         concept.quantity
//     );
//     obj.price.amount = Decimal.mul(obj.price.priceUnit, concept.quantity);
//     obj.base = Decimal.sub(priceWithoutIva, obj.amountDiscount);
//     obj.iva = Decimal.mul(obj.base, Decimal.sub(iva, 1));
//     obj.subtotal = priceWithoutIva;
//     obj.total = Decimal.add(obj.base, obj.iva);
//     return obj;
// }
//
// const getTotalExtraCharge = (extraCharges: ExtraCharges[], price: number, type: InvoiceModules): { becas: Decimal, recargos: Decimal, discount: Decimal } => {
//     const value = new Decimal(0.00);
//     let objTemp = { becas: value, recargos: value, discount: value };
//     switch (type) {
//         case 1:
//             //ACADEMIA DESCUENTO SOBRE DESCUENTO
//             objTemp.becas = new Decimal(getTotalAfterExtraCharge({ total: price, extraCharges, typeExtraCharges: 3 }));
//             objTemp.discount = new Decimal(getTotalAfterExtraCharge({ total: objTemp.becas.toNumber(), extraCharges, typeExtraCharges: 1 }));
//             objTemp.recargos = new Decimal(getTotalAfterExtraCharge({ total: objTemp.discount.toNumber(), extraCharges, typeExtraCharges: 2 }));
//             console.log({
//                 price: price,
//                 objTemp: objTemp
//             })
//             return {
//                 becas: Decimal.sub(price, objTemp.becas),
//                 recargos: Decimal.sub(objTemp.discount, objTemp.recargos),
//                 discount: Decimal.sub(price, objTemp.discount)
//             }
//         default:
//             // TIENDA Y COLEGIO DESCUENTOS NORMALES
//             objTemp.becas = new Decimal(getTotalAfterExtraCharge({ total: price, extraCharges, typeExtraCharges: 3 }));
//             objTemp.discount = new Decimal(getTotalAfterExtraCharge({ total: price, extraCharges, typeExtraCharges: 1 }));
//             objTemp.recargos = new Decimal(getTotalAfterExtraCharge({ total: price, extraCharges, typeExtraCharges: 2 }));
//             return {
//                 becas: Decimal.sub(price, objTemp.becas),
//                 recargos: Decimal.sub(price, objTemp.recargos),
//                 discount: Decimal.sub(price, objTemp.discount)
//             }
//     }
// }
//
// const getPrice = <T extends Detalles>(detail: T, type: InvoiceModules): number => {
//     if (type == InvoiceModules.STORE) {
//         return detail.priceWithIVA;
//     } else {
//         return typeof detail.price == 'string' ? parseFloat(`${detail.price}`) : detail.price;
//     }
// }
//
// const getDataPercentage = (payload: {details: any[], type: InvoiceModules}): {totalConcept: Decimal[], becas: Decimal[], recargos: Decimal[], discount: Decimal[]} => {
//     const { details, type } = payload;
//     let datapercentage = {becas: [],discount: [], recargos: [], totalConcept: []}
//     details.forEach((concept) => {
//         const { extraCharges = [] } = concept;
//         let price = getPrice(concept, type);
//         const totalExtraCharge =  getTotalExtraCharge(extraCharges, price, type)
//         datapercentage.totalConcept.push(Decimal.mul(price, concept.quantity));
//         datapercentage.becas.push(totalExtraCharge.becas);
//         datapercentage.discount.push(totalExtraCharge.discount);
//         datapercentage.recargos.push(totalExtraCharge.recargos);
//     });
//     return datapercentage
// }
//
// const getPercentage = (payload: {totalConcept: Decimal, becas: Decimal, recargos: Decimal, discount: Decimal, pago: number}): string => {
//     const { pago, totalConcept, becas, discount, recargos } = payload
//     return parseFloat(
//         Decimal.div(
//             Decimal.mul(pago, 100.00),
//             Decimal.sub(
//                 Decimal.add(totalConcept, recargos),
//                 Decimal.add(becas, discount
//             ))
//         ).toDecimalPlaces(6).toString()).toFixed(6);
// }
//
// const TotalWithPercentage = (payload: {obj: ChargesDetails, percentage: string }): ChargesDetails => {
//     const { obj, percentage } = payload;
//     return {
//         quantity: obj.quantity,
//         base: Decimal.mul(Decimal.div(obj.base,100.00), percentage),
//         iva: Decimal.mul(Decimal.div(obj.iva,100.00), percentage),
//         subtotal: Decimal.mul(Decimal.div(obj.subtotal,100.00), percentage),
//         total: Decimal.mul(Decimal.div(obj.total,100.00), percentage),
//         amountDiscount: Decimal.mul(Decimal.div(obj.amountDiscount,100.00), percentage),
//         data: {
//             becas: Decimal.mul(Decimal.div(obj.data.becas,100.00), percentage),
//             recargos: Decimal.mul(Decimal.div(obj.data.recargos,100.00), percentage),
//             discount: Decimal.mul(Decimal.div(obj.data.discount,100.00), percentage),
//         },
//         price: {
//             amount: Decimal.mul(Decimal.div(obj.price.amount,100.00), percentage),
//             priceUnit: Decimal.mul(Decimal.div(obj.price.priceUnit,100.00), percentage),
//         }
//     }
// }
