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
import LineItemsForm from "~/components/LineItemsForm";

const resolver = zodResolver(BillSchema);

type BillFormProps = {
    categories: Category[]
    vendors: Vendor[]
    defaultValues: {
        date: string,
        dueDate: string,
        categoryId: string
        vendor: string
        notes?: string,
        lineItems: {
            description: string;
            quantity: number;
            price: number;
        }[];
    },
}

export default function BillForm({categories, vendors, defaultValues}: BillFormProps) {
    const {
        formState: {errors},
        handleSubmit,
        register,
        setValue,
        watch
    } = useRemixForm<zod.infer<typeof BillSchema>>({
        resolver,
        defaultValues: defaultValues
    });
    const location = useLocation();
    const navigation = useNavigation()
    const navigate = useNavigate()
    const loading = navigation.state !== 'idle'
    const isEdit = location.pathname.includes('edit')
    const {lineItems} = watch()
    return (
        <Form className='flex flex-col gap-4 pt-4'
              onSubmit={handleSubmit}
        >
            <div className='flex flex-col gap-4 w-1/3'>
                <div>
                    <p className='font-medium'>Bill Date</p>
                    <DatePicker setValue={setValue}/>
                    {errors.date && <p className='text-destructive'>{errors.date.message}</p>}
                </div>
                <div>
                    <p className='font-medium'>Due Date</p>
                    <DatePicker setValue={setValue} valToSet='dueDate'/>
                    {errors.dueDate && <p className='text-destructive'>{errors.dueDate.message}</p>}
                </div>
                <div>
                    <p className='font-medium'>Vendor</p>
                    <SelectClientOrVendor onValueChange={setValue} vendors={vendors} defaultValue={defaultValues.vendor}
                                          valToChange='vendor'/>
                    {errors.vendor && <p className='text-destructive'>{errors.vendor.message}</p>}
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
            </div>

            <h2 className='text-lg font-semibold'>Items/Services</h2>
            <LineItemsForm lineItems={lineItems} register={register} setValue={setValue} errors={errors}/>
            <h2 className='text-lg font-semibold'>Total Amount: ${lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0)}</h2>
            <div className='flex gap-4'>
                <Button disabled={loading} type='submit'>{isEdit ? 'Edit' : 'Add'} Bill</Button>
                <Button type='button' variant='outline' onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        </Form>
    )
}