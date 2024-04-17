import {Category} from "@prisma/client";
import {useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import {expenseSchema, resolverExpense as resolver} from "~/lib/Types";
import {Form, useLocation, useNavigate, useNavigation} from "@remix-run/react";
import SelectCategory from "~/components/SelectCategory";
import DatePicker from "~/components/DatePicker";
import {Textarea} from "~/components/ui/ui/textarea";
import {Input} from "~/components/ui/ui/input";
import {Button} from "~/components/ui/ui/button";

type ExpenseFormProps = {
    categories: Category[]
    defaultValues: {
        date: string,
        categoryId: string
        merchantName: string
        notes: string | null,
    },
}

export default function ExpenseForm({categories, defaultValues}: ExpenseFormProps) {
    const {
        formState: {errors},
        handleSubmit,
        register,
        setValue,
    } = useRemixForm<zod.infer<typeof expenseSchema>>({
        resolver,
        defaultValues: defaultValues
    });
    const location = useLocation();
    const navigation = useNavigation()
    const navigate = useNavigate()
    const loading = navigation.state !== 'idle'
    const isEdit = location.pathname.includes('edit')
    return (
        <Form className='flex flex-col gap-4 pt-4 w-1/3' onSubmit={handleSubmit}>
            <div>
                <p className='font-medium'>Description</p>
                <Input {...register('notes')} name='notes' id='notes' placeholder='Description'/>
                {errors.notes && <p className='text-destructive'>{errors.notes.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Merchant</p>
                <Input {...register('merchantName')} name='merchantName' id='merchant' placeholder='Merchant'/>
                {errors.merchantName && <p className='text-destructive'>{errors.merchantName.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Expense Date</p>
                <DatePicker setValue={setValue}/>
                {errors.date && <p className='text-destructive'>{errors.date.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Amount</p>
                <Input onBlur={(e) => setValue('amount', Number(e.target.value))} name='amount' id='amount' placeholder='Amount'/>
                {errors.amount && <p className='text-destructive'>{errors.amount.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Category</p>
                <SelectCategory defaultValue={defaultValues.categoryId} onValueChange={setValue}
                                categories={categories}/>
                {errors.categoryId && <p className='text-destructive'>{errors.categoryId.message}</p>}
            </div>
            <div className='flex gap-4'>
                <Button disabled={loading} type='submit'>{isEdit ? 'Edit' : 'Add'} Expense</Button>
                <Button type='button' variant='outline' onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        </Form>
    )
}