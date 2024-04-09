import DatePicker from "~/components/DatePicker";
import {Input} from "~/components/ui/ui/input";
import SelectComp from "~/components/Select";
import SelectCategory from "~/components/SelectCategory";
import {Textarea} from "~/components/ui/ui/textarea";
import {Button} from "~/components/ui/ui/button";
import {Form, Link, useLocation, useNavigation} from "@remix-run/react";
import {useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import {TransactionSchema} from "~/lib/Types";
import {zodResolver} from "@hookform/resolvers/zod";
import {Category, Client} from "@prisma/client";
import SelectClient from "~/components/Clients/SelectClient";

const resolver = zodResolver(TransactionSchema);

type TransactionFormProps = {
    categories: Category[]
    clients: Client[]
    defaultValues: {
        date: string
        type: 'expense' | 'income' | undefined
        categoryId: string
        payeePayer: string
        paymentMethod: string
        amount: number
        notes?: string
    },
    transactionId?: string
}

export default function TransactionForm({categories, clients, defaultValues, transactionId}: TransactionFormProps) {
    const {
        formState: {errors},
        handleSubmit,
        register,
        setValue,
        watch
    } = useRemixForm<zod.infer<typeof TransactionSchema>>({
        resolver,
        defaultValues: defaultValues
    });
    const location = useLocation();
    const navigation = useNavigation()
    const loading = navigation.state !== 'idle'
    const isEdit = location.pathname.includes('edit')
    const optionsTransactionType = [{value: 'expense', text: 'Expense'}, {value: 'income', text: 'Income'}]
    const paymentMethods = [{value: 'cash', text: 'Cash'}, {value: 'credit', text: 'Credit'}, {
        value: 'debit',
        text: 'Debit'
    }, {value: 'check', text: 'Check'}, {value: 'bank-transfer', text: 'Bank Transfer'}, {
        value: 'other',
        text: 'Other'
    }]
    const {type} = watch()
    const filteredCategories = type ? categories.filter(category => category.type === type) : categories
    return (
        <Form className='flex flex-col gap-4 pt-4 w-1/3'
              onSubmit={handleSubmit}
        >
            <div>
                <p className='font-medium'>Transaction Date</p>
                <DatePicker setValue={setValue}/>
                {errors.date && <p className='text-destructive'>{errors.date.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Amount - $</p>
                <Input defaultValue={defaultValues.amount} onBlur={(e) => setValue('amount', Number(e.target.value))}
                       id='amount' type='number'
                       name='amount' placeholder='Amount'/>
                {errors.amount && <p className='text-destructive'>{errors.amount.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Vendor</p>
                <SelectClient onValueChange={setValue} clients={clients} defaultValue={defaultValues.payeePayer}/>
                {errors.paymentMethod && <p className='text-destructive'>{errors.paymentMethod.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Payment Method</p>
                <SelectComp defaultValue={defaultValues.paymentMethod} onValueChange={setValue}
                            valToChange='paymentMethod' options={paymentMethods}
                            placeholder='Payment Method'/>
                {errors.paymentMethod && <p className='text-destructive'>{errors.paymentMethod.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Transaction type</p>
                <SelectComp defaultValue={defaultValues.type} onValueChange={setValue} valToChange='type'
                            options={optionsTransactionType}
                            placeholder='Transaction Type'/>
                {errors.type && <p className='text-destructive'>{errors.type.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Transaction Category</p>
                <SelectCategory defaultValue={defaultValues.categoryId} onValueChange={setValue}
                                categories={filteredCategories}/>
                {errors.categoryId && <p className='text-destructive'>{errors.categoryId.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Notes</p>
                <Textarea {...register('notes')} name='notes' id='notes' placeholder='Notes'/>
                {errors.notes && <p className='text-destructive'>{errors.notes.message}</p>}
            </div>
            <div className='flex gap-4'>
                <Button disabled={loading} type='submit'>{isEdit ? 'Edit' : 'Add'} Transaction</Button>
                <Link to={isEdit ? `/transactions/${transactionId}` : `/transactions`}><Button variant='outline'>Go
                    Back</Button></Link>
            </div>
        </Form>
    )
}