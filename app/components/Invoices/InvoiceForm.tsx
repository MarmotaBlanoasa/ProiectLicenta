import {useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import {DefaultValuesInvoice, invoiceSchema, resolverInvoice as resolver} from "~/lib/Types";
import {Form, useLocation, useNavigate, useNavigation} from "@remix-run/react";
import {Input} from "~/components/ui/ui/input";
import DatePicker from "~/components/DatePicker";
import {Button} from "~/components/ui/ui/button";
import {Client} from "@prisma/client";
import SelectClientOrVendor from "~/components/SelectClientOrVendor";
import LineItemsForm from "~/components/LineItemsForm";

type InvoiceFormProps = {
    defaultValues: DefaultValuesInvoice
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
    const {lineItems} = watch()
    const navigation = useNavigation();
    const navigate = useNavigate()
    const location = useLocation()
    const isEdit = location.pathname.includes('edit')
    const isSubmitting = navigation.state !== 'idle';
    return (
        <Form className='flex flex-col gap-4 pt-4' onSubmit={handleSubmit}>
            <h2 className='text-lg font-semibold'>Invoice Details</h2>
            <div className='w-1/3'>
                <p className='font-medium'>Invoice Number</p>
                <Input type='text' {...register('invoiceNumber')} name='invoiceNumber' id='invoiceNumber'/>
                {errors.invoiceNumber && <p className='text-red-500'>{errors.invoiceNumber.message}</p>}
            </div>
            <div className='w-1/3'>
                <p className='font-medium'>Client</p>
                <SelectClientOrVendor onValueChange={setValue} clients={clients} defaultValue={defaultValues.payeePayer}
                                      valToChange='payeePayer'/>
            </div>
            <div className='w-1/3'>
                <p className='font-medium'>Date Issued</p>
                <DatePicker setValue={setValue} valToSet='dateIssued'/>
            </div>
            <div className='w-1/3'>
                <p className='font-medium'>Due Date</p>
                <DatePicker setValue={setValue} valToSet='dueDate'/>
            </div>
            <h2 className='text-lg font-semibold'>Items/Services</h2>
            <LineItemsForm lineItems={lineItems} register={register} setValue={setValue} errors={errors}/>
            <h2 className='text-lg font-semibold'>Subtotal Amount:
                ${lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0)}</h2>
            <h2 className='text-lg font-semibold'>Total Amount:
                ${lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0) * (((item.tva || 1) / 100) + 1), 0)}</h2>
            <div className='flex gap-4'>
                <Button type='submit' disabled={isSubmitting}>{isEdit ? 'Edit' : 'Add'} Invoice</Button>
                <Button type='button' variant='outline' onClick={() => navigate(-1)}>Go back</Button>
            </div>
        </Form>
    )
}