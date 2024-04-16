import Header from "~/components/Header";
import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getVendorsByUserId} from "~/models/vendor.server";
import {Vendor} from "@prisma/client";
import {useLoaderData} from "react-router";
import {DataTable} from "~/components/DataTable";
import {vendorsColumns} from "~/components/Vendors/VendorsColumns";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const vendors = await getVendorsByUserId(userId);
    return json({vendors});
}


export default function VendorsIndex(){
    const {vendors} = useLoaderData() as {vendors: Vendor[]};
    return (
        <>
            <Header title='Vendors'>
                <div className='flex gap-4'>
                    <Link to='/vendors/add-vendor'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Vendor
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                 <DataTable columns={vendorsColumns} data={vendors} header='VENDORS' />
            </div>
        </>
    )
}