import Header from "~/components/Header";
import {Form, useActionData} from "@remix-run/react";
import * as zod from "zod";
import DatePicker from "~/components/DatePicker";
import {ActionFunction, ActionFunctionArgs, json, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "~/components/ui/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/ui/select";
import SelectComp from "~/components/ui/Select";
const schema = zod.object({
    date: zod.date(),
    type: zod.enum(['expense', 'income']),
    categoryId: zod.string(),
    payeePayer: zod.string(),
    paymentMethod: zod.string(),
    amount: zod.number(),
    notes: zod.string(),
});
const resolver = zodResolver(schema);
export const action = async ({request}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
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
    // await addTransaction({userId, date, type, categoryId, payeePayer, paymentMethod, amount, notes});
    return redirect('/transactions/all');
}


export default function AddTransaction() {
    const {formState: {errors}, handleSubmit, register, setValue} = useRemixForm<zod.infer<typeof schema>>({
        resolver,
        defaultValues: {date: new Date(), type: 'expense', categoryId: '', payeePayer: '', paymentMethod: '', amount: 0, notes: ''},
    });
    const actionData = useActionData<ActionFunction>();
    return (
        <>
            <Header title='Add New Transaction'
                    description='Fill out the form below to record a new financial transaction.'>
            </Header>
            <Form className='flex flex-col gap-4 pt-4' action='/transactions.add-transaction'>
                <div>
                    {/*<label htmlFor='date'>Date</label>*/}
                    {/*<Input type='date' name='date' id='date'/>*/}
                    <DatePicker />
                    {errors.date && <p className='text-destructive'>{errors.date.message}</p>}
                </div>
                <div>
                    <SelectComp />
                    {errors.type && <p className='text-destructive'>{errors.type.message}</p>}
                </div>
            </Form>
        </>
    )
}