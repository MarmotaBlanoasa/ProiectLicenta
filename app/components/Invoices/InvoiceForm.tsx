import {useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import {invoiceSchema, resolverInvoice as resolver} from "~/lib/Types";
import {Form} from "@remix-run/react";
import {Input} from "~/components/ui/ui/input";
import DatePicker from "~/components/DatePicker";
import SelectComp from "~/components/Select";
import {Button} from "~/components/ui/ui/button";
import {useState} from "react";
import { Client } from "@prisma/client";
import SelectClient from "~/components/Clients/SelectClient";

type InvoiceFormProps = {
    defaultValues: {
        invoiceNumber: string
        dateIssued: string
        dueDate: string
        nextBillingDate: string | null
        paidAmount: number
        status: 'paid' | 'unpaid' | 'overdue'
        recurring: boolean
        lineItems: {
            description: string
            quantity: number
            price: number
        }[]
    },
    clients: Client[]

}

export default function InvoiceForm({defaultValues, clients}: InvoiceFormProps) {
    const {
        formState: {errors},
        handleSubmit,
        register,
        setValue,
        watch
    } = useRemixForm<zod.infer<typeof invoiceSchema>>({
        resolver,
        defaultValues: defaultValues
    });
    const [taxes, setTaxes] = useState(19)
    const [discount, setDiscount] = useState(0)
    const invoiceOptions = [{value: 'paid', text: 'Paid'}, {value: 'unpaid', text: 'Unpaid'}, {
        value: 'overdue',
        text: 'Overdue'
    }]
    return (
        <Form className='flex flex-col gap-4 pt-4 w-1/3' onSubmit={handleSubmit}>
            <h2 className='text-lg font-semibold'>Invoice Details</h2>
            <div>
                <p className='font-medium'>Invoice Number</p>
                <Input type='text' {...register('invoiceNumber')} name='invoiceNumber' id='invoiceNumber'/>
                {errors.invoiceNumber && <p className='text-red-500'>{errors.invoiceNumber.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Vendor</p>
                <SelectClient onValueChange={setValue} clients={clients} />
            </div>
            <div>
                <p className='font-medium'>Date Issued</p>
                <DatePicker setValue={setValue} valToSet='dateIssued'/>
            </div>
            <div>
                <p className='font-medium'>Due Date</p>
                <DatePicker setValue={setValue} valToSet='dueDate'/>
            </div>
            <div>
                <p className='font-medium'>Paid Amount</p>
                <Input type='number' name='paidAmount' onBlur={(e) => setValue('paidAmount', Number(e.target.value))}
                       id='paidAmount' placeholder='Paid Amount'/>
                {errors.paidAmount && <p className='text-red-500'>{errors.paidAmount.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Status</p>
                <SelectComp onValueChange={setValue} valToChange='status' placeholder='Select Invoice Status'
                            options={invoiceOptions}/>
                {errors.status && <p className='text-red-500'>{errors.status.message}</p>}
            </div>
            <h2 className='text-lg font-semibold'>Items/Services</h2>
            <div>
                <p className='font-medium'>Line Items</p>
                {watch().lineItems.map((_, index) => (
                    <div key={index} className='flex gap-4'>
                        <Input type='text'  {...register(`lineItems.${index}.description`)}
                               id={`lineItems.${index}.description`} placeholder='Description'/>
                        <Input type='number'
                               onBlur={(e) => setValue(`lineItems.${index}.quantity`, Number(e.target.value))}
                               id={`lineItems.${index}.quantity`} placeholder='Quantity'/>
                        <Input type='number'
                               onBlur={(e) => setValue(`lineItems.${index}.price`, Number(e.target.value))}
                               id={`lineItems.${index}.price`} placeholder='Price'/>
                        {index > 0 && <Button variant='ghost' type='button'
                                              onClick={() => setValue('lineItems', watch().lineItems.filter((_, i) => i !== index))}>Remove</Button>}
                    </div>
                ))}
                {errors.lineItems && <p className='text-red-500'>{errors.lineItems.message}</p>}
                <Button variant='link' type='button' onClick={() => setValue('lineItems', [...watch().lineItems, {
                    description: '',
                    quantity: 0,
                    price: 0
                }])}>Add Line Item</Button>
            </div>
            <h2 className='text-lg font-semibold'>Summary</h2>
            <div className='flex gap-4'>
                <div>
                    <p className='font-medium'>Subtotal</p>
                    <Input type='number'
                           value={watch().lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}
                           readOnly/>
                </div>
                <div>
                    <p className='font-medium'>Taxes%</p>
                    <Input type='number' min={0} value={taxes}
                           onChange={(e) => setTaxes(Number(e.target.value))}
                    />
                </div>
                <div>
                    <p className='font-medium'>Discount%</p>
                    <Input type='number' value={discount}
                           onChange={(e) => setDiscount(Number(e.target.value))}/>
                </div>
                <div>
                    <p className='font-medium'>Total</p>
                    <Input type='number'
                           value={watch().lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0) * (1 + taxes / 100) - (1 + discount / 100)}
                           readOnly/>
                </div>
            </div>
            <Button type='submit'>Save Invoice</Button>
        </Form>
    )
}