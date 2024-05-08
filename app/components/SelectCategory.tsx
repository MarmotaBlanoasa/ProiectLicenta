import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/ui/select";
import {AccountingAccount} from "@prisma/client";

export default function SelectCategory({onValueChange, accounts, defaultValue}: {
    onValueChange: any,
    accounts: AccountingAccount[],
    defaultValue?: string
}) {
    return (
        <Select defaultValue={defaultValue} onValueChange={(value) => onValueChange('accountingAccountId', value)}>
            <SelectTrigger>
                <SelectValue placeholder="Select Category"/>
            </SelectTrigger>
            <SelectContent>
                {accounts.map((account, index) => (
                    <SelectItem key={index} value={account.id}>
                        {account.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}