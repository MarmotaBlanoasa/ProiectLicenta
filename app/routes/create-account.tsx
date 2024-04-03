import {Form, Link, useActionData} from "@remix-run/react";
import {Input} from "~/components/ui/ui/input";
import {
    ActionFunction,
    type ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    MetaFunction,
    redirect
} from "@remix-run/node";
import {createUserSession, getUserId} from "~/session.server";
import {safeRedirect} from "~/utils";
import {createUser, getUserByEmail} from "~/models/user.server";
import * as zod from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {Button} from "~/components/ui/ui/button";

export const meta: MetaFunction = () => [{title: "Sign Up"}];

const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
    confirm_password: zod.string().min(8),
    businessName: zod.string(),
    phone: zod.string(),
    address: zod.string(),
    taxInfo: zod.string()
}).refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});
const resolver = zodResolver(schema);
export const loader = async ({request}: LoaderFunctionArgs) => {
    const userId = await getUserId(request);
    if (userId) return redirect("/dashboard");
    return json({});
};
export const action = async ({request}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const {email, password, businessName, phone, address, taxInfo} = data;
    const redirectTo = safeRedirect('/dashboard', "/");
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return json(
            {
                errors: {
                    email: "A user already exists with this email",
                    password: null,
                },
            },
            {status: 400},
        );
    }

    const user = await createUser(email, password, businessName, phone, address, taxInfo);

    return createUserSession({
        redirectTo,
        remember: false,
        request,
        userId: user.id,
    });
};
export default function CreateAccount() {
    const {formState: {errors}, handleSubmit, register} = useRemixForm<zod.infer<typeof schema>>({
        resolver,
        defaultValues: {
            email: "",
            password: "",
            businessName: "",
            phone: "",
            address: "",
            confirm_password: "",
            taxInfo: ''
        }
    });
    const actionData = useActionData<ActionFunction>();
    return (
        <div className='flex flex-grow-1'>
            {/*<div className='w-screen bg-primary h-screen'/>*/}
            <div className='flex flex-col justify-center items-center px-12 h-screen w-screen'>
                <Form
                    method="post"
                    action='/create-account'
                    onSubmit={handleSubmit}
                    className='flex flex-col gap-4 w-1/4'
                >
                    <div>
                        <p>Welcome,</p>
                        <h1 className='font-bold text-2xl'>Create Account</h1>
                    </div>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <Input {...register('email')} id='email' type='email' name='email' placeholder='Email'/>
                        {errors.email && <p className='text-destructive'>{errors.email.message}</p>}
                        {actionData?.errors?.email && <p className='text-destructive'>{actionData.errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <Input {...register('password')} id='password' type='password' name='password'
                               placeholder='Password'/>
                        {errors.password && <p className='text-destructive'>{errors.password.message}</p>}
                    </div>
                    <div>
                        <label htmlFor='confirm_password'>Confirm Password</label>
                        <Input {...register('confirm_password')} id='confirm_password' type='password'
                               name='confirm_password'
                               placeholder='Confirm Password'
                        />
                        {errors.confirm_password &&
                            <p className='text-destructive'>{errors.confirm_password.message}</p>}
                    </div>
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
                        <label htmlFor='taxInfo'>Tax Info</label>
                        <Input {...register('taxInfo')} id='taxInfo' type='text' name='taxInfo' placeholder='Tax Info'/>
                        {errors.taxInfo && <p className='text-destructive'>{errors.taxInfo.message}</p>}
                    </div>
                    <input type='hidden' name='redirectTo' value='/dashboard'/>
                    <Button type='submit'>Create Account</Button>
                    <p>Already have an account? <Link to='/login' className='underline text-primary'>Login</Link></p>
                </Form>
            </div>
        </div>
    )
}