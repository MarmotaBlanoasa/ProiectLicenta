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
import {updateAccountingAccount} from "~/models/accounting_accounts.server";

const schema = zod.object({
    businessName: zod.string(),
    phone: zod.string(),
    address: zod.string(),
    taxInfo: zod.string(),
    bankBalance: zod.number(),
    cashBalance: zod.number(),
})
const resolver = zodResolver(schema);
export const action = async ({request}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof schema>>(request, resolver);
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const {businessName, phone, address, taxInfo, bankBalance, cashBalance} = data;
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

    await Promise.all([
        updateInfoById(userId, businessName, phone, address, taxInfo, bankBalance, cashBalance),
        updateAccountingAccount({userId, code:'5311', balance: cashBalance}),
        updateAccountingAccount({userId, code:'5121', balance: bankBalance}),
        ],
    )
    return redirect('/profile');
};
export default function ProfileChangeInformation() {
    const {user} = useRouteData('/') as { user: User };
    const {formState: {errors}, handleSubmit, register, setValue} = useRemixForm<zod.infer<typeof schema>>({
        resolver,
        defaultValues: {
            businessName: user.businessName || '',
            phone: user.phone || '',
            address: user.address || '',
            taxInfo: user.taxInfo || '' || '',
            bankBalance: user.bankBalance || 0,
            cashBalance: user.cashBalance || 0
        },
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
                    <Input {...register('taxInfo')} id='taxInfo' type='text' name='taxInfo'
                           placeholder='ex VAT ID, Tax ID, etc...'/>
                    {errors.taxInfo && <p className='text-destructive'>{errors.taxInfo.message}</p>}
                </div>
                <div>
                    <label htmlFor='bankBalance'>Bank Balance</label>
                    <Input onBlur={(e) => setValue('bankBalance', Number(e.target.value))} id='bankBalance'
                           type='number' name='bankBalance' placeholder='Bank Balance'/>
                    {errors.bankBalance && <p className='text-destructive'>{errors.bankBalance.message}</p>}
                </div>
                <div>
                    <label htmlFor='cashBalance'>Cash Balance</label>
                    <Input onBlur={(e) => setValue('cashBalance', Number(e.target.value))} id='cashBalance'
                           type='number' name='cashBalance' placeholder='Cash Balance'/>
                    {errors.cashBalance && <p className='text-destructive'>{errors.cashBalance.message}</p>}
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