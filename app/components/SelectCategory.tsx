import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/ui/select";
import {Category} from "@prisma/client";

export default function SelectCategory({onValueChange, categories}: {
    onValueChange: any,
    categories: Category[]
}) {
    return (
        <Select onValueChange={(value) => onValueChange('categoryId', value)}>
            <SelectTrigger>
                <SelectValue placeholder="Select Category"/>
            </SelectTrigger>
            <SelectContent>
                {categories.map((category, index) => (
                    <SelectItem key={index} value={category.id}>
                        {category.name} - {category.type}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}