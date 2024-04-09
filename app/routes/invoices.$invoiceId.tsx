import Header from "~/components/Header";
import {Outlet, useLocation} from "@remix-run/react";

export default function InvoicesInvoiceId(){
    const location = useLocation();
    if (location.pathname.includes('edit')) {
        return <Outlet/>
    }
    return (
        <>
            <Header title={'Invoice Details'}/>
        </>
    )
}