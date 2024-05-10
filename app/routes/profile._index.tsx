import Header from "~/components/Header";
import {Button} from "~/components/ui/ui/button";
import {useRouteData} from "~/utils";
import {User} from "@prisma/client";
import {Link} from "@remix-run/react";

export default function Profile_index() {
    const {user} = useRouteData('/') as { user: User };
    return (
        <>
            <Header title='Profile'>
                <div className='flex gap-4'>
                    <Link to='/profile/change-information'>
                        <Button>Change Information</Button>
                    </Link>
                    <Link to='/profile/change-password'>
                        <Button>Change Password</Button>
                    </Link>
                </div>
            </Header>
            <div className='flex flex-col gap-4 pt-4'>
                <h2 className='text-lg font-medium'>Business Information</h2>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Email</p>
                    <p>{user.email}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Business Name</p>
                    <p>{user.businessName || 'No business name provided'}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Business Address</p>
                    <p>{user.address || 'No address provided'}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Numar de telefon</p>
                    <p>{user.phone || 'Numarul de telefon nu a fost introdus'}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>CUI</p>
                    <p>{user.taxInfo || 'CUI nu a fost introdus'}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Cash</p>
                    <p>{user.cashBalance || 'Balanta nu a fost adaugata'} RON</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Banca</p>
                    <p>{user.bankBalance || 'Balanata nu a fost adaugata'} RON</p>
                </div>
            </div>
        </>
    )
}