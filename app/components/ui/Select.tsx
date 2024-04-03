import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/ui/select";

export default function SelectComp(){
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="expense">Light</SelectItem>
                <SelectItem value="income">Dark</SelectItem>
            </SelectContent>
        </Select>
    )
}