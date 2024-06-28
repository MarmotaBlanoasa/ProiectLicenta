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
            <h1 className='text-2xl font-bold pb-6'>FinanceForge</h1>
            <div className='flex flex-col gap-4'>
                <NavLink to='/dashboard' name='Dashboard' icon='dashboard'/>
                <NavLink to='/clients' name='Clienți' icon='clients'/>
                <NavLink to='/vendors' name='Vânzători' icon='vendors'/>
                <NavLink to='/bills' name='Facturi primite' icon='bills'/>
                {/*<NavLink to='/expenses' name='Expenses' icon='expenses'/>*/}
                <NavLink to='/invoices' name='Facturi emise' icon='invoices'/>
                <NavLink to='/payments' name='Plăți' icon='payments'/>
                <NavLink to='/profile' name='Profil' icon='profile'/>
            </div>
            <div className='absolute bottom-8' onClick={handleLogout}>
                <NavLink to='/logout' name='Delogare' icon='logout' arrow={false}/>
            </div>
        </nav>
    )
}