import Header from "~/components/Header";
import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";

export default function Invoices() {
    return (
        <div className='ms-[15%] px-12 py-8'>
            <Header title='Invoices'
                    description='Manage your invoicing efficiently. Create, send, and track the status of your invoices all in one place.'>
                <div className='flex gap-4'>
                    <Link to='/profile/change-information'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Invoice
                        </Button>
                    </Link>
                </div>
            </Header>
        </div>
    )
}