import {Outlet} from "@remix-run/react";
export default function Clients() {
    return (
        <div className='ms-[15%] px-12 py-8'>
            <Outlet />
        </div>
    )
}