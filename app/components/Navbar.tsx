import {protectedRouteIds} from "~/utils";
import NavLink from "~/components/NavLink";
import {useSubmit} from "@remix-run/react";

export default function Navbar(){
    const submit = useSubmit()
    const handleLogout = (data: any) =>{
        submit(data, {method: 'post', action: '/logout'})
    }
    return (
        <nav className='bg-primary text-white h-screen fixed z-40 p-6 w-[15%] overflow-hidden'>
            <h1 className='text-2xl font-bold pb-6'>Logo Name</h1>
            <div className='flex flex-col gap-4'>
                <NavLink to='/dashboard' name='Dashboard' icon='dashboard'/>
                <NavLink to='/clients' name='Clients' icon='clients'/>
                <NavLink to='/vendors' name='Vendors' icon='clients'/>
                <NavLink to='/bills' name='Bills' icon='transactions'/>
                <NavLink to='/expenses' name='Expenses' icon='transactions'/>
                <NavLink to='/invoices' name='Invoices' icon='invoices'/>
                <NavLink to='/profile' name='Profile' icon='profile'/>
            </div>
            <div className='absolute bottom-8' onClick={handleLogout}>
                <NavLink to='/logout' name='logout' icon='logout' arrow={false}/>
            </div>
        </nav>
    )
}