import {Client, Vendor} from "@prisma/client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/ui/select";

export default function SelectClientOrVendor({onValueChange, clients, defaultValue, valToChange, vendors}: {
    onValueChange: any,
    clients?: Client[],
    vendors?: Vendor[],
    valToChange: string,
    defaultValue?: string
}) {
    return (
        <Select defaultValue={defaultValue} onValueChange={(value) => onValueChange(valToChange, value)}>
            <SelectTrigger>
                <SelectValue placeholder="Select Vendor"/>
            </SelectTrigger>
            <SelectContent>
                {clients && clients.map((client, index) => (
                    <SelectItem key={index} value={client.id}>
                        {client.name}
                    </SelectItem>
                ))}
                {vendors && vendors.map((vendor, index) => (
                    <SelectItem key={index} value={vendor.id}>
                        {vendor.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}