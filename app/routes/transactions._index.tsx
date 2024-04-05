import Header from "~/components/Header";
import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";

export default function AllTransactions(){
    return (
        <>
            <Header title='Transactions'
                    description='View and manage all your financial transactions. Add, edit, or categorize your income
                    and expenses to keep your finances organized.'>
                <div className='flex gap-4'>
                    <Link to='/transactions/add-transaction'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Transaction
                        </Button>
                    </Link>
                </div>
            </Header>
        </>
    )
}