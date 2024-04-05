import Header from "~/components/Header";
import {Form, Link, useActionData, useNavigation} from "@remix-run/react";
import * as zod from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ActionFunction, ActionFunctionArgs, json, redirect} from "@remix-run/node";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {getUserId} from "~/session.server";
import {addClient} from "~/models/client.server";
import {Input} from "~/components/ui/ui/input";
import {Textarea} from "~/components/ui/ui/textarea";
import {Button} from "~/components/ui/ui/button";
const schema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    phone: zod.string(),
    address: zod.string(),
    notes: zod.string(),
});
const resolver = zodResolver(schema);
export const action = async ({request}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const {name, email, phone, address, notes} = data;
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
    await addClient({userId, name, email, phone, address, notes});
    return redirect('/clients/all');
};
export default function ClientsAddClient() {
    const {formState: {errors}, handleSubmit, register} = useRemixForm<zod.infer<typeof schema>>({
        resolver,
        defaultValues: {name: '', email: '', phone: '', address: '', notes: ''},
    });
    const actionData = useActionData<ActionFunction>();
    const navigation = useNavigation();
    const isSubmitting = navigation.formAction === '/clients.add-client'
    return (
        <>
            <Header title='Add New Client'
                    description="Enter your client's details below to add them to your account. Ensure the information is accurate to facilitate smooth transactions and communications.">
            </Header>
            <Form className='flex flex-col gap-4 pt-4 w-1/3' onSubmit={handleSubmit} action='/clients.add-client'>
                <div>
                    <label htmlFor='businessName'>Client Name</label>
                    <Input {...register('name')} id='name' type='text' name='name'
                           placeholder='Client Name'/>
                    {errors.name && <p className='text-destructive'>{errors.name.message}</p>}
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <Input {...register('email')} id='email' type='email' name='email' placeholder='Email'/>
                    {errors.email && <p className='text-destructive'>{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor='phone'>Phone number</label>
                    <Input {...register('phone')} id='phone' type='tel' name='phone' placeholder='Phone number'/>
                    {errors.phone && <p className='text-destructive'>{errors.phone.message}</p>}
                </div>
                <div>
                    <label htmlFor='address'>Address</label>
                    <Input {...register('address')} id='address' type='text' name='address' placeholder='Client Address'/>
                    {errors.address && <p className='text-destructive'>{errors.address.message}</p>}
                </div>
                <div>
                    <label htmlFor='notes'>Notes</label>
                    <Textarea {...register('notes')} id='notes' name='notes' placeholder='Notes'/>
                    {errors.notes && <p className='text-destructive'>{errors.notes.message}</p>}
                </div>
                {actionData?.errors?.critical && <p className='text-destructive'>{actionData.errors.critical}</p>}
                <div className='flex gap-4'>
                    <Button type='submit' disabled={isSubmitting}>Add New Client</Button>
                    <Link to='/clients/all'><Button type='button' variant='outline'>Go Back</Button></Link>
                </div>
            </Form>
        </>
    )
}