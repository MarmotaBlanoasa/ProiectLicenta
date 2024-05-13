import {Input} from "~/components/ui/ui/input";

export default function BillHeader({table} : {table: any}){
    return (
        <div className="flex items-center py-4">
            <Input
                placeholder="Filter category..."
                value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("category")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
        </div>
    )
}