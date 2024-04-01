import Header from "~/components/Header";
import {Button} from "~/components/ui/ui/button";
import {useRouteData} from "~/utils";
import {User} from "~/lib/Types";
export default function Profile(){
    const {user } = useRouteData('/') as {user: User};
    return (
        <div className='ms-[15%] px-12 py-8'>
            <Header title='Profile'>
                <div className='flex gap-4'>
                    <Button>Change Information</Button>
                    <Button>Update Password</Button>
                </div>
            </Header>
            <div className='flex flex-col gap-4'>
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
                    <p className='font-medium'>Phone Number</p>
                    <p>{user.phone || 'No phone provided'}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Tax Information</p>
                    <p>{user.taxInfo || 'No tax information provided'}</p>
                </div>
            </div>
        </div>
    )
}