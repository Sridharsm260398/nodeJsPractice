import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Injectable({
 providedIn: 'root'
})
export class PdfService {
 constructor() { }
 generatePDF(data: any): void {
   const doc = new jsPDF();
   const orderRes = data.orderRes;
   const itemRes = data.itemRes;
   doc.text('Invoice', 14, 16);
   doc.setFontSize(11);
   doc.text(`Order ID: ${orderRes.order_id}`, 14, 23);
   doc.text(`Invoice No: ${orderRes.invoice_no}`, 14, 28);
   doc.text(`Order Date: ${new Date(orderRes.order_date).toLocaleDateString()}`, 14, 33);
   doc.text(`Invoice Date: ${new Date(orderRes.invoice_date).toLocaleDateString()}`, 14, 38);
   const soldByText = splitTextAndGetHeight(doc, `Sold By: ${orderRes.sold_by_name}`, 200);
   doc.text(soldByText.textLines, 14, 43);
   const soldByAddressText = splitTextAndGetHeight(doc, `Address: ${orderRes.sold_by_address}`, 200);
   doc.text(soldByAddressText.textLines, 14, 43 + soldByText.height);
   const soldByRegisteredAddressText = splitTextAndGetHeight(doc, `Registered Address: ${orderRes.sold_by_registered_address}`, 200);
   doc.text(soldByRegisteredAddressText.textLines, 14, 43 + soldByText.height + soldByAddressText.height);
   const shippingAddressText = splitTextAndGetHeight(doc, `Shipping Address: ${orderRes.shipping_address}`, 200);
   doc.text(shippingAddressText.textLines, 14, 43 + soldByText.height + soldByAddressText.height + soldByRegisteredAddressText.height + 5);
   const billingAddressText = splitTextAndGetHeight(doc, `Billing Address: ${orderRes.billing_address}`, 200);
   doc.text(billingAddressText.textLines, 14, 43 + soldByText.height + soldByAddressText.height + soldByRegisteredAddressText.height + shippingAddressText.height + 10);
   autoTable(doc, {
     startY: 43 + soldByText.height + soldByAddressText.height + soldByRegisteredAddressText.height + shippingAddressText.height + billingAddressText.height + 15,
     head: [['Product', 'Description', 'Qty', 'Gross Amount', 'Discount', 'Taxable Value', 'IGST', 'Total']],
     body: itemRes.map((item: any) => [
       item.product,
       item.description,
       item.qty,
       item.gross_amount,
       item.discount,
       item.taxable_value,
       item.igst,
       item.total
     ])
   });
   function splitTextAndGetHeight(doc: jsPDF, text: string, maxWidth: number) {
    const textLines = doc.splitTextToSize(text, maxWidth);
    const height = textLines.length * doc.getLineHeight();
    return { textLines, height };
   }
   const finalY = (doc as any).lastAutoTable.finalY || 80;
   const declarationText = splitTextAndGetHeight(doc, `Declaration: ${orderRes.declaration}`, 200);
   doc.text(declarationText.textLines, 14, finalY + 10);
  
   doc.text(`Total Quantity: ${orderRes.total_qty}`, 14, finalY + declarationText.height + 16);
   doc.text(`Total Price: ${orderRes.total_price}`, 14, finalY + declarationText.height + 21);
   doc.save('invoice.pdf');
   
 }
}