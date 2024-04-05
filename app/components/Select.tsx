import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/ui/select";

export default function SelectComp({onValueChange, valToChange, placeholder, options, defaultValue}: {
    onValueChange: any,
    valToChange: string,
    placeholder: string,
    defaultValue?: string,
    options: { value: string, text: string }[]
}) {
    return (
        <Select defaultValue={defaultValue} onValueChange={(value) => onValueChange(valToChange, value)}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder}/>
            </SelectTrigger>
            <SelectContent>
                {options.map((option, index) => (
                    <SelectItem key={index} value={option.value}>
                        {option.text}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}