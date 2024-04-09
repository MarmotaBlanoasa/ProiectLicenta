import {Client, Invoice} from "@prisma/client";
import {Button} from "~/components/ui/ui/button";
import {format} from "date-fns";
import {useRef} from "react";
import {usePDF} from "react-to-pdf";

type InvoiceBodyProps = {
    invoice: Invoice & { lineItems: { description: string, quantity: number, price: number }[] }
    client: Client,
    businessName: string
}

export default function InvoiceBody({invoice, client, businessName}: InvoiceBodyProps) {
        const {toPDF, targetRef} = usePDF({filename: `invoice_${invoice.id}.pdf`})
    return (
        <div className='border border-blue-900 rounded-lg shadow-lg max-w-4xl'>
            <div className="px-12 pt-12 pb-4 max-w-4xl"
                 ref={targetRef}>
                <h1 className="font-bold text-2xl my-4">{businessName}</h1>
                <hr className='border border-skyWave mb-4'/>
                <div className="flex justify-between mb-6">
                    <h2 className="text-lg font-bold ">Invoice</h2>
                    <div className="">
                        <div>Date: {format(invoice.dateIssued, 'PPP')}</div>
                        <div>Invoice {invoice.invoiceNumber}</div>
                    </div>
                </div>
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-4 ">Bill To:</h2>
                    <div className=" mb-2">{client.name}</div>
                    <div className=" mb-2">{client.phone}</div>
                    <div className=" mb-2">{client.address}</div>
                    <div className="">{client.email}</div>
                </div>
                <table className="w-full mb-8">
                    <thead>
                    <tr>
                        <th className="text-left font-bold ">Description</th>
                        <th className="text-center font-bold ">Quantity</th>
                        <th className="text-right font-bold ">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoice.lineItems.map((lineItem, index) => (
                        <tr key={index}>
                            <td className="text-left ">{lineItem.description}</td>
                            <td className="text-center ">x{lineItem.quantity}</td>
                            <td className="text-right ">{lineItem.price}</td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th className="text-left font-bold ">Total</th>
                        <th className="text-center font-bold "></th>
                        <th className="text-right font-bold ">${invoice.totalAmount}</th>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <div className='ps-12 pb-12'>
                <Button type='button' onClick={()=>toPDF()}>Print Invoice</Button>
            </div>
        </div>
    )
}