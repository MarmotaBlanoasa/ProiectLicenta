import {Form, useLocation, useNavigate, useNavigation} from "@remix-run/react";
import {useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import { resolverVendor as resolver, vendorSchema} from "~/lib/Types";
import {Button} from "~/components/ui/ui/button";
import {Input} from "~/components/ui/ui/input";

type VendorsFormProps = {
    defaultValues: {
        name: string
        email: string
        phone: string | undefined | null
        address: string | undefined | null
        website: string | undefined | null
    }
}

export default function VendorsForm({defaultValues}: VendorsFormProps) {
    const location = useLocation()
    const isEdit = location.pathname.includes('edit')
    const navigation = useNavigation()
    const navigate = useNavigate()
    const isSubmitting = navigation.state !== 'idle'
    const {formState: {errors}, handleSubmit, register} = useRemixForm<zod.infer<typeof vendorSchema>>({
        resolver,
        defaultValues: defaultValues,
    });
    return (
        <Form className='flex flex-col gap-4 pt-4 w-1/3' onSubmit={handleSubmit}>
            <div>
                <label htmlFor='name'>Vendor Name</label>
                <Input {...register('name')} id='name' type='text' name='name'
                       placeholder='Vendor Name'/>
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
                <Input {...register('address')} id='address' type='text' name='address' placeholder='Vendor Address'/>
                {errors.address && <p className='text-destructive'>{errors.address.message}</p>}
            </div>
            <div>
                <label htmlFor='website'>Website</label>
                <Input {...register('website')} id='website' type='text' name='website' placeholder='Vendor Website'/>
                {errors.website && <p className='text-destructive'>{errors.website.message}</p>}
            </div>
            <div className='flex gap-4'>
                <Button type='submit' disabled={isSubmitting}>
                    {isEdit ? 'Update Vendor' : 'Add Vendor'}
                </Button>
                <Button variant='outline' type='button' onClick={() => navigate(-1)}>
                    Go back
                </Button>
            </div>
        </Form>
    )
}