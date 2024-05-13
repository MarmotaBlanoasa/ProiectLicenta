import Header from "~/components/Header";
import {Link, Outlet, useLoaderData, useLocation, useNavigate} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getVendorById} from "~/models/vendor.server";
import {Vendor} from "@prisma/client";

export const loader:LoaderFunction = async ({request,params}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const {vendorId} = params;
    if (!vendorId) {
        return redirect('/vendors')
    }
    const vendorDetails = await getVendorById({id: vendorId, userId});
    return json({vendorDetails})
}


export default function VendorVendorId(){
    const {vendorDetails} = useLoaderData() as {vendorDetails: Vendor};
    const navigate = useNavigate();
    const location = useLocation();
    if (location.pathname.includes('edit')) {
        return <Outlet context={{vendorDetails}}/>
    }
    return (
        <>
            <Header title={vendorDetails.name}>
                <div className='flex gap-4'>
                    <Link to={`/vendors/${vendorDetails.id}/edit`}>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='edit'/>
                            Edit Vendor
                        </Button>
                    </Link>
                    <Button variant='secondary' onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    <Link to={`/vendors/${vendorDetails.id}/delete`}>
                        <Button className='flex gap-2 items-center' variant='destructive'>
                            <Svg icon='edit'/>
                            Delete Vendor
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <div className='flex flex-col gap-4'>
                    <div>
                        <h2 className='text-lg font-bold'>Vendor Name</h2>
                        <p>{vendorDetails.name}</p>
                    </div>
                    <div>
                        <h2 className='text-lg font-bold'>Email</h2>
                        <p>{vendorDetails.email}</p>
                    </div>
                    <div>
                        <h2 className='text-lg font-bold'>Phone</h2>
                        <p>{vendorDetails.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <h2 className='text-lg font-bold'>Address</h2>
                        <p>{vendorDetails.address || 'N/A'}</p>
                    </div>
                    <div>
                        <h2 className='text-lg font-bold'>Website</h2>
                        <p>{vendorDetails.website || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </>
    )
}