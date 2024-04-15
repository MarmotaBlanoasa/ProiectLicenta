import DatePicker from "~/components/DatePicker";
import {Input} from "~/components/ui/ui/input";
import SelectComp from "~/components/Select";
import SelectCategory from "~/components/SelectCategory";
import {Textarea} from "~/components/ui/ui/textarea";
import {Button} from "~/components/ui/ui/button";
import {Form, useLocation, useNavigate, useNavigation} from "@remix-run/react";
import {useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import {BillSchema} from "~/lib/Types";
import {zodResolver} from "@hookform/resolvers/zod";
import {Category, Client, Vendor} from "@prisma/client";
import SelectClient from "~/components/SelectClientOrVendor";
import SelectClientOrVendor from "~/components/SelectClientOrVendor";

const resolver = zodResolver(BillSchema);

type BillFormProps = {
    categories: Category[]
    vendors: Vendor[]
    defaultValues: {
        date: string
        categoryId: string
        vendor: string
        paymentMethod: string
        amount: number
        notes?: string
    },
}

export default function BillForm({categories, vendors, defaultValues}: BillFormProps) {
    const {
        formState: {errors},
        handleSubmit,
        register,
        setValue
    } = useRemixForm<zod.infer<typeof BillSchema>>({
        resolver,
        defaultValues: defaultValues
    });
    const location = useLocation();
    const navigation = useNavigation()
    const navigate = useNavigate()
    const loading = navigation.state !== 'idle'
    const isEdit = location.pathname.includes('edit')
    const paymentMethods = [{value: 'cash', text: 'Cash'}, {value: 'credit', text: 'Credit'}, {
        value: 'debit',
        text: 'Debit'
    }, {value: 'check', text: 'Check'}, {value: 'bank-transfer', text: 'Bank Transfer'}, {
        value: 'other',
        text: 'Other'
    }]
    return (
        <Form className='flex flex-col gap-4 pt-4 w-1/3'
              onSubmit={handleSubmit}
        >
            <div>
                <p className='font-medium'>Bill Date</p>
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
                <SelectClientOrVendor onValueChange={setValue} vendors={vendors} defaultValue={defaultValues.vendor} valToChange='vendor'/>
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
                <p className='font-medium'>Category</p>
                <SelectCategory defaultValue={defaultValues.categoryId} onValueChange={setValue}
                                categories={categories}/>
                {errors.categoryId && <p className='text-destructive'>{errors.categoryId.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Notes</p>
                <Textarea {...register('notes')} name='notes' id='notes' placeholder='Notes'/>
                {errors.notes && <p className='text-destructive'>{errors.notes.message}</p>}
            </div>
            <div className='flex gap-4'>
                <Button disabled={loading} type='submit'>{isEdit ? 'Edit' : 'Add'} Bill</Button>
                <Button type='button' variant='outline' onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        </Form>
    )
}