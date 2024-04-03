import Header from "~/components/Header";
import {ActionFunction, ActionFunctionArgs, json, redirect} from "@remix-run/node";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import * as zod from "zod";
import {getUserId} from "~/session.server";
import {updateInfoById} from "~/models/user.server";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, Link, useActionData} from "@remix-run/react";
import {Input} from "~/components/ui/ui/input";
import {Button} from "~/components/ui/ui/button";
import {useRouteData} from "~/utils";
import {User} from "@prisma/client";
const schema = zod.object({
    businessName: zod.string(),
    phone: zod.string(),
    address: zod.string(),
    taxInfo: zod.string(),
})
const resolver = zodResolver(schema);
export const action = async ({request}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const { businessName, phone, address, taxInfo} = data;
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

    await updateInfoById(userId, businessName, phone, address, taxInfo);
    return redirect('/profile');
};
export default function ProfileChangeInformation(){
    const {user} = useRouteData('/') as { user: User };
    const {formState: {errors}, handleSubmit, register} = useRemixForm<zod.infer<typeof schema>>({
        resolver,
        defaultValues: {businessName: user.businessName || '', phone: user.phone || '', address: user.address || '', taxInfo: user.taxInfo || ''},
    });
    const actionData = useActionData<ActionFunction>();
    return (
        <>
            <Header title='Profile - Change Information'/>
            <Form method='post' onSubmit={handleSubmit} className='flex flex-col gap-4 w-1/3 pt-4'>
                <div>
                    <label htmlFor='businessName'>Business Name</label>
                    <Input {...register('businessName')} id='businessName' type='text' name='businessName'
                           placeholder='Business Name'/>
                    {errors.businessName && <p className='text-destructive'>{errors.businessName.message}</p>}
                </div>
                <div>
                    <label htmlFor='phone'>Phone number</label>
                    <Input {...register('phone')} id='phone' type='tel' name='phone' placeholder='Phone number'/>
                    {errors.phone && <p className='text-destructive'>{errors.phone.message}</p>}
                </div>
                <div>
                    <label htmlFor='address'>Address</label>
                    <Input {...register('address')} id='address' type='text' name='address' placeholder='Address'/>
                    {errors.address && <p className='text-destructive'>{errors.address.message}</p>}
                </div>
                <div>
                    <label htmlFor='taxInfo'>Tax Information</label>
                    <Input {...register('taxInfo')} id='taxInfo' type='text' name='taxInfo' placeholder='ex VAT ID, Tax ID, etc...'/>
                    {errors.taxInfo && <p className='text-destructive'>{errors.taxInfo.message}</p>}
                </div>
                <div className='flex gap-4'>
                    <Button type='submit'>Change Information</Button>
                    <Link to='/profile'><Button type='button' variant='outline'>Go Back</Button></Link>
                </div>
                {actionData?.errors?.critical && <p className='text-destructive'>{actionData.errors.critical}</p>}
            </Form>
        </>
    )
}