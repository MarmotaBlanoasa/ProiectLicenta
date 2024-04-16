import Header from "~/components/Header";
import {DataTable} from "~/components/DataTable";
import {expensesColumns} from "~/components/Expenses/ExpensesColumns";
import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";

export default function ExpensesIndex(){
    return (
        <>
            <Header title='Expenses'>
                <div className='flex gap-4'>
                    <Link to='/expenses/add-expense'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Expense
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <DataTable columns={expensesColumns} data={[]} header='EXPENSES' />
            </div>
        </>
    )
}