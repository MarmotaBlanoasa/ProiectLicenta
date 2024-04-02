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
        <div className={`px-4 py-2 hover:bg-primary/90 ${active ? 'bg-primary/90' : 'bg-transparent'}`}>
            <Link to={to}
                  className='flex justify-between items-center no-underline text-snow hover:bg-primary/90'>
                <div className='flex gap-2 items-center'>
                    <Svg icon={icon}/>
                    {name.charAt(0).toUpperCase() + name.slice(1, name.length).toLowerCase()}
                </div>
                {arrow && <Svg icon='arrow'/>}
            </Link>
        </div>
    )
}