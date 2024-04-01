import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";
import * as zod from "zod";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "~/components/ui/ui/input";
import {Button} from "~/components/ui/ui/button";

const schema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8),
});
const resolver = zodResolver(schema);

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
  if (errors) {
    return json({errors, receivedValues}, {status: 400});
  }
    const {email, password} = data;
  const redirectTo = safeRedirect('/dashboard', "/");

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: true,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const {formState: {errors}, handleSubmit, register} = useRemixForm<zod.infer<typeof schema>>({
    resolver,
    defaultValues: {email: "", password: ""}
  });
  const actionData = useActionData<ActionFunction>();

  return (
      <div className='flex flex-grow-1'>
        {/*<div className='w-screen bg-primary h-screen'/>*/}
        <div className='flex flex-col justify-center items-center px-12 h-screen w-screen'>
          <Form
              method="post"
              action='/login'
              onSubmit={handleSubmit}
              className='flex flex-col gap-4 w-1/4'
          >
            <div>
              <p>Welcome,</p>
              <h1 className='font-bold text-2xl'>Log In</h1>
            </div>
            <div>
              <label htmlFor='email'>Email</label>
              <Input {...register('email')} id='email' type='email' name='email' placeholder='Email'/>
              {errors.email && <p className='text-destructive'>{errors.email.message}</p>}
              {actionData?.errors?.email && <p className='text-destructive'>{actionData?.errors?.email}</p>}
            </div>
            <div>
              <label htmlFor='password'>Password</label>
              <Input {...register('password')} id='password' type='password' name='password'
                     placeholder='Password'/>
              {errors.password && <p className='text-destructive'>{errors.password.message}</p>}
            </div>
            <input type='hidden' name='redirectTo' value='/dashboard'/>
            <Button type='submit'>Log in</Button>
            <p>Don't have an account? <Link to='/create-account' className='underline text-primary'>Create new account</Link></p>
          </Form>
        </div>
      </div>
  );
}
