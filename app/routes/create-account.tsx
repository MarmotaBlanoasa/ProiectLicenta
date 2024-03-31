import {Form} from "@remix-run/react";
import {Input} from "~/components/ui/ui/input";
import {type ActionFunctionArgs, json, LoaderFunctionArgs, MetaFunction, redirect} from "@remix-run/node";
import {createUserSession, getUserId} from "~/session.server";
import {safeRedirect} from "~/utils";
import {createUser, getUserByEmail} from "~/models/user.server";
import * as zod from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {useEffect, useRef, useState} from "react";
import {Button} from "~/components/ui/ui/button";

export const meta: MetaFunction = () => [{title: "Sign Up"}];

const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
    confirm_password: zod.string().min(8),
    businessName: zod.string(),
    phone: zod.string(),
    address: zod.string(),
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
    const {email, password, businessName, phone, address, confirm_password} = data;
    const redirectTo = safeRedirect('/dashboard', "/");
    const existingUser = await getUserByEmail(email);
    if (password != confirm_password){
        return json(
            {
                errors: {
                    confirm_password: "Passwords do not match",
                },
            },
            {status: 400},
        );
    }
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

    const user = await createUser(email, password, businessName, phone, address);

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
        defaultValues: {email: "", password: "", businessName: "", phone: "", address: "", confirm_password: ""}
    });
    return (
        <div>
            <h1>Create Account</h1>
            <Form
                method="post"
                action='/create-account'
                onSubmit={handleSubmit}
            >
                <Input {...register('email')} id='email' type='email' name='email' placeholder='Email'/>
                {errors.email && <p>{errors.email.message}</p>}
                <Input {...register('password')} id='password' type='password' name='password' placeholder='Password'
                />
                {errors.password && <p>{errors.password.message}</p>}
                <Input {...register('confirm_password')} id='confirm_password' type='password' name='confirm_password'
                       placeholder='Confirm Password'
                />
                <Input {...register('businessName')} id='businessName' type='text' name='businessName'
                       placeholder='Business Name'/>
                {errors.businessName && <p>{errors.businessName.message}</p>}
                <Input {...register('address')} id='address' type='text' name='address' className='Business Address'
                       placeholder='Business Address'/>
                {errors.address && <p>{errors.address.message}</p>}
                <Input {...register('phone')} id='phone' type='tel' name='phone' className='Phone number'
                       placeholder='Phone number'/>
                {errors.phone && <p>{errors.phone.message}</p>}
                <input type='hidden' name='redirectTo' value='/dashboard'/>
                <Button type='submit'>Create Account</Button>
            </Form>
        </div>
    )
}