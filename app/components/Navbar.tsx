import {protectedRouteIds} from "~/utils";
import NavLink from "~/components/NavLink";
import {useSubmit} from "@remix-run/react";

export default function Navbar(){
    const submit = useSubmit()
    const handleLogout = (data: any) =>{
        submit(data, {method: 'post', action: '/logout'})
    }
    return (
        <nav className='bg-primary text-white h-screen fixed z-40 p-6 w-[15%]'>
            <h1 className='text-2xl font-bold pb-6'>Logo Name</h1>
            <div className='flex flex-col gap-4'>
                {protectedRouteIds.slice(0, protectedRouteIds.length - 1).map((route, index) => (
                    <NavLink key={index} to={route} name={route.slice(1,route.length)} icon={route.slice(1,route.length)}/>)
                )}
            </div>
            <div className='absolute bottom-8' onClick={handleLogout}>
                <NavLink to='/logout' name='logout' icon='logout' arrow={false}/>
            </div>
        </nav>
    )
}