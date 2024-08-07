import {Link, useLocation} from "@remix-run/react";
import Svg from "~/components/Svg";

type NavLinkProps = {
    to: string;
    name: string;
    icon: string;
    arrow?: boolean;
}
export default function NavLink({to, name, icon, arrow = true}: NavLinkProps) {
    const location = useLocation()
    const active = location.pathname === to
    return (
        <div className={`px-4 py-2 hover:bg-secondary hover:text-secondary-foreground transition ease-out 0.2 ${active ? 'bg-secondary' : 'bg-transparent'}`}>
            <Link to={to}
                  className='flex justify-between items-center no-underline text-white'>
                <div className='flex gap-2 items-center'>
                    <Svg icon={icon}/>
                    {name.charAt(0).toUpperCase() + name.slice(1, name.length).toLowerCase()}
                </div>
                {arrow && <Svg icon='arrow'/>}
            </Link>
        </div>
    )
}