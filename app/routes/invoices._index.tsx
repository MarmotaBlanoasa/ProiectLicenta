import Header from "~/components/Header";
import {Link, useLoaderData} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getAllInvoicesByUser} from "~/models/invoice.server";
import {Invoice} from "@prisma/client";
import {DataTable} from "~/components/DataTable";
import {invoiceColumns} from "~/components/Invoices/InvoiceColumns";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const invoices = await getAllInvoicesByUser({userId})
    const invoicesData = invoices.map(invoice => {
        return {
            ...invoice,
            client: invoice.client.name
        }
    })
    return json({invoicesData})
}

export default function InvoicesIndex() {
    const {invoicesData} = useLoaderData() as unknown as { invoicesData: Invoice[] }
    console.log(invoicesData)
    return (
        <>
            <Header title='Invoices'
                    description='Manage your invoicing efficiently. Create, send, and track the status of your invoices all in one place.'>
                <div className='flex gap-4'>
                    <Link to='/invoices/add-invoice'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Invoice
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <DataTable columns={invoiceColumns} data={invoicesData} header='INVOICES' />
            </div>
        </>
    )
}