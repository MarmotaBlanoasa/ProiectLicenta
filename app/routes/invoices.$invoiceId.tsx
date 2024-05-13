import Header from "~/components/Header";
import {Link, Outlet, useLoaderData, useLocation, useNavigate} from "@remix-run/react";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getInvoiceById} from "~/models/invoice.server";
import {Client, Invoice} from "@prisma/client";
import {LineItem} from ".prisma/client";
import {format} from "date-fns";
import InvoiceBody from "~/components/Invoices/InvoiceBody";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {invoiceId} = params
    if (!invoiceId) {
        return redirect('/invoices')
    }
    const invoiceDetails = await getInvoiceById({id: invoiceId, userId})
    return json({invoiceDetails})
}

export default function InvoicesInvoiceId() {
    const location = useLocation();
    const navigate = useNavigate();
    if (location.pathname.includes('edit')) {
        return <Outlet/>
    }
    const {invoiceDetails} = useLoaderData() as unknown as {
        invoiceDetails: Invoice & { lineItems: LineItem[] } & { client: Client }
    }
    return (
        <>
            <Header title={`Invoice ${invoiceDetails.invoiceNumber}`}>
                <div className='flex gap-4'>
                    <Link to={`/invoices/${invoiceDetails.id}/edit`}>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='edit'/>
                            Edit Invoice
                        </Button>
                    </Link>
                    <Button variant='secondary' onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    <Link to={`/invoices/${invoiceDetails.id}/delete`}>
                        <Button className='flex gap-2 items-center' variant='destructive'>
                            <Svg icon='edit'/>
                            Delete Invoice
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <h2 className='text-lg font-semibold italic mb-8'>Preview</h2>
                <InvoiceBody invoice={invoiceDetails} client={invoiceDetails.client} businessName='Rares SRL'/>
            </div>
        </>
    )
}