import {Form, Link, useActionData, useLocation, useNavigation} from "@remix-run/react";
import {Input} from "~/components/ui/ui/input";
import {Textarea} from "~/components/ui/ui/textarea";
import {Button} from "~/components/ui/ui/button";
import {useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import {ClientSchema, resolverClient as resolver} from "~/lib/Types";
import {ActionFunction} from "@remix-run/node";

type ClientFormProps = {
    action?: string
    defaultValues: {
        name: string
        email: string | undefined
        phone: string | undefined
        address: string | undefined
        notes: string | undefined
    }
    clientId?: string
}

export default function ClientForm({action, defaultValues, clientId}: ClientFormProps) {
    const location = useLocation();
    const isEdit = location.pathname.includes('edit');
    const {formState: {errors}, handleSubmit, register} = useRemixForm<zod.infer<typeof ClientSchema>>({
        resolver,
        defaultValues: defaultValues,
    });
    const navigation = useNavigation();
    const isSubmitting = navigation.state !== 'idle';
    const actionData = useActionData<ActionFunction>();
    return(
        <Form className='flex flex-col gap-4 pt-4 w-1/3' onSubmit={handleSubmit}>
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
                <Button type='submit' disabled={isSubmitting}>{isEdit? 'Edit' : 'Add'} New Client</Button>
                <Link to={isEdit? `/clients/${clientId}` : `/clients`}><Button type='button' variant='outline'>Go Back</Button></Link>
            </div>
        </Form>
    )
}