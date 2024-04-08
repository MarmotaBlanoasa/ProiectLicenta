import {Client} from "@prisma/client";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/ui/select";

export default function SelectClient({onValueChange, clients, defaultValue}: {
    onValueChange: any,
    clients: Client[],
    defaultValue?: string
}) {
    return (
        <Select defaultValue={defaultValue} onValueChange={(value) => onValueChange('payeePayer', value)}>
            <SelectTrigger>
                <SelectValue placeholder="Select Vendor"/>
            </SelectTrigger>
            <SelectContent>
                {clients.map((client, index) => (
                    <SelectItem key={index} value={client.id}>
                        {client.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}