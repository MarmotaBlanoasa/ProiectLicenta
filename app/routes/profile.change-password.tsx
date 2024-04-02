import Header from "~/components/Header";
import {Form, Link, useActionData} from "@remix-run/react";
import {ActionFunction, ActionFunctionArgs, json} from "@remix-run/node";
import * as zod from "zod";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "~/components/ui/ui/button";
import {Input} from "~/components/ui/ui/input";
import {updatePasswordById} from "~/models/user.server";
import {getUserId, logout} from "~/session.server";
const schema = zod.object({
    currentPassword: zod.string().min(8),
    newPassword: zod.string().min(8),
    confirmPassword: zod.string().min(8),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
const resolver = zodResolver(schema);

export const action = async ({request}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const {currentPassword, newPassword} = data;
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
    const updatePassword = await updatePasswordById(userId,currentPassword, newPassword);
    if(updatePassword === 'INVALID_PASSWORD'){
        return json(
            {
                errors: {
                    currentPassword: 'Current password is incorrect',
                },
            },
            {status: 400},
        );
    }
    return logout(request);
}

export default function ProfileChangePassword(){
    const {formState: {errors}, handleSubmit, register} = useRemixForm<zod.infer<typeof schema>>({
        resolver,
        defaultValues: {currentPassword: '', newPassword: '', confirmPassword: ''},
    });
    const actionData = useActionData<ActionFunction>();
    return (
        <>
            <Header title='Profile - Change Password'/>
            <Form className='flex flex-col gap-4 w-1/3 pt-4' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='currentPassword'>Current Password</label>
                    <Input {...register('currentPassword')} id='currentPassword' type='password' name='currentPassword' placeholder='Current Password'/>
                </div>
                {errors.currentPassword && <p className='text-destructive'>{errors.currentPassword.message}</p>}
                <div>
                    <label htmlFor='newPassword'>New Password</label>
                    <Input {...register('newPassword')} id='newPassword' type='password' name='newPassword' placeholder='New Password'/>
                </div>
                {errors.newPassword && <p className='text-destructive'>{errors.newPassword.message}</p>}
                <div>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <Input {...register('confirmPassword')} id='confirmPassword' type='password' name='confirmPassword' placeholder='Confirm Password'/>
                </div>
                {errors.confirmPassword && <p className='text-destructive'>{errors.confirmPassword.message}</p>}
                {actionData?.errors?.critical && <p className='text-destructive'>{actionData.errors.critical}</p>}
                <div className='flex gap-4'>
                    <Button type='submit'>Change Password</Button>
                    <Link to='/profile/information'><Button type='button' variant='outline'>Go Back</Button></Link>
                </div>
            </Form>
        </>
    )
}