import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import Header from "~/components/Header";

export default function AllClients(){
    return (
        <>
            <Header title='Clients' description='Keep your client details organized. View client information, add new clients, or update existing
                    client profiles effortlessly'>
                <div className='flex gap-4'>
                    <Link to='/clients/add-client'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Client
                        </Button>
                    </Link>
                </div>
            </Header>
        </>
    )
}