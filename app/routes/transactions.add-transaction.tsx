import Header from "~/components/Header";
import {Form, Link, useActionData} from "@remix-run/react";
import * as zod from "zod";
import DatePicker from "~/components/DatePicker";
import {ActionFunction, ActionFunctionArgs, json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import SelectComp from "~/components/Select";
import {getAllCategories} from "~/models/category.server";
import {useLoaderData} from "react-router";
import SelectCategory from "~/components/SelectCategory";
import {Input} from "~/components/ui/ui/input";
import {Textarea} from "~/components/ui/ui/textarea";
import {Button} from "~/components/ui/ui/button";
import {addTransaction} from "~/models/transaction.server";

const schema = zod.object({
    date: zod.string().datetime(),
    type: zod.enum(['expense', 'income']),
    categoryId: zod.string(),
    payeePayer: zod.string(),
    paymentMethod: zod.string(),
    amount: zod.number(),
    notes: zod.string().optional(),
});
const resolver = zodResolver(schema);

export const loader: LoaderFunction = async ({request}) => {
    const categories = await getAllCategories();
    return json({categories});
}
export const action = async ({request}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    console.log(data)
    const {date, type, categoryId, payeePayer, paymentMethod, amount, notes} = data;
    const userId = await getUserId(request);
    if (!userId) {
        return json(
            {
                errors: {
                    critical: 'An error occurred while updating your information. Please try again later.',
                },
            },
            {status: 400},
        );
    }
    await addTransaction({userId, date, type, categoryId, payeePayer, paymentMethod, amount, notes});
    return redirect('/transactions');
}


export default function AddTransaction() {
    const {
        formState: {errors},
        handleSubmit,
        register,
        setValue,
        getFieldState
    } = useRemixForm<zod.infer<typeof schema>>({
        resolver,
        defaultValues: {
            date: new Date().toISOString(),
            type: '',
            categoryId: '',
            payeePayer: '',
            paymentMethod: '',
            amount: 0,
            notes: ''
        },
    });
    const actionData = useActionData<ActionFunction>();
    const optionsTransactionType = [{value: 'expense', text: 'Expense'}, {value: 'income', text: 'Income'}]
    const paymentMethods = [{value: 'cash', text: 'Cash'}, {value: 'credit', text: 'Credit'}, {value: 'debit', text: 'Debit'}, {value: 'check', text: 'Check'},{value:'bank-transfer', text:'Bank Transfer'}, {value:'other', text:'Other'}]
    const {categories} = useLoaderData<LoaderFunction>();
    console.log(getFieldState('date'))
    return (
        <>
            <Header title='Add New Transaction'
                    description='Fill out the form below to record a new financial transaction.'>
            </Header>
            <Form className='flex flex-col gap-4 pt-4 w-1/3' action='/transactions.add-transaction'
                  onSubmit={handleSubmit}
            >
                <div>
                    <p className='font-medium'>Transaction Date</p>
                    <DatePicker setValue={setValue}/>
                    {errors.date && <p className='text-destructive'>{errors.date.message}</p>}
                </div>
                <div>
                    <p className='font-medium'>Amount - $</p>
                    <Input onBlur={(e) => setValue('amount', Number(e.target.value))} id='amount' type='number'
                           name='amount' placeholder='Amount'/>
                    {errors.amount && <p className='text-destructive'>{errors.amount.message}</p>}
                </div>
                <div>
                    <p className='font-medium'>Payee/Payer</p>
                    <Input {...register('payeePayer')} name='payeePayer' id='payeePayer' placeholder='Payee/Payer'/>
                    {errors.payeePayer && <p className='text-destructive'>{errors.payeePayer.message}</p>}
                </div>
                <div>
                    <p className='font-medium'>Payment Method</p>
                    <SelectComp onValueChange={setValue} valToChange='paymentMethod' options={paymentMethods}
                                placeholder='Payment Method'/>
                    {errors.paymentMethod && <p className='text-destructive'>{errors.paymentMethod.message}</p>}
                </div>
                <div>
                    <p className='font-medium'>Transaction type</p>
                    <SelectComp onValueChange={setValue} valToChange='type' options={optionsTransactionType}
                                placeholder='Transaction Type'/>
                    {errors.type && <p className='text-destructive'>{errors.type.message}</p>}
                </div>
                <div>
                    <p className='font-medium'>Transaction Category</p>
                    <SelectCategory onValueChange={setValue} categories={categories}/>
                    {errors.categoryId && <p className='text-destructive'>{errors.categoryId.message}</p>}
                </div>
                <div>
                    <p className='font-medium'>Notes</p>
                    <Textarea {...register('notes')} name='notes' id='notes' placeholder='Notes'/>
                    {errors.notes && <p className='text-destructive'>{errors.notes.message}</p>}
                </div>
                <div className='flex gap-4'>
                    <Button type='submit'>Add Transaction</Button>
                    <Link to='/transactions'><Button variant='outline'>Go Back</Button></Link>

                </div>
            </Form>
        </>
    )
}