import {useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import {paymentSchema, resolverPayment as resolver} from "~/lib/Types";
import {Form, useFetcher, useLocation, useNavigate, useNavigation} from "@remix-run/react";
import DatePicker from "~/components/DatePicker";
import SelectComp from "~/components/Select";
import {paymentMethods} from "~/utils";
import {Button} from "~/components/ui/ui/button";
import {Input} from "~/components/ui/ui/input";

type PaymentFormProps = {
    defaultValues: {
        paymentDate: string,
        amount: number,
        method: string,
        billId?: string,
        invoiceId?: string,
    },
}
export default function PaymentForm({defaultValues}: PaymentFormProps) {
    const fetcher = useFetcher()
    const {
        formState: {errors},
        handleSubmit,
        register,
        setValue,
    } = useRemixForm<zod.infer<typeof paymentSchema>>({
        resolver,
        defaultValues: defaultValues,
        submitConfig: {
            method: 'post',
            action: '/payments/add-payment',
        },
        fetcher: fetcher,
    });
    const location = useLocation();
    const navigation = useNavigation()
    const loading = navigation.state !== 'idle'
    const isEdit = location.pathname.includes('edit')
    return (
        <Form className='flex flex-col gap-4 pt-4' onSubmit={handleSubmit}>
            <Input {...register('billId')} type='hidden' id='billId'/>
            <Input {...register('invoiceId')} type='hidden' id='invoiceId'/>
            <div>
                <p className='font-medium'>Payment Date</p>
                <DatePicker setValue={setValue} valToSet='paymentDate'/>
                {errors.paymentDate && <p className='text-destructive'>{errors.paymentDate.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Amount</p>
                <Input onBlur={(e) => setValue('amount', Number(e.target.value))} type='number' name='amount'
                       id='amount' placeholder='Amount'/>
                {errors.amount && <p className='text-destructive'>{errors.amount.message}</p>}
            </div>
            <div>
                <p className='font-medium'>Payment Method</p>
                <SelectComp onValueChange={setValue} valToChange='method' placeholder='Payment method'
                            options={paymentMethods}/>
                {errors.method && <p className='text-destructive'>{errors.method.message}</p>}
            </div>
            <div className='flex gap-4'>
                <Button type='submit' disabled={loading}>
                    {isEdit ? 'Update Payment' : 'Add Payment'}
                </Button>
                {/*<Button type='button' variant='outline' onClick={() => navigate(-1)} disabled={loading}>Go*/}
                {/*    Back</Button>*/}
            </div>
        </Form>
    )
}