import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/ui/popover";
import {Button} from "~/components/ui/ui/button";
import {cn} from "~/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react"
import {useState} from "react";
import {format} from "date-fns";
import {Calendar} from "~/components/ui/ui/calendar";
export default function DatePicker(){
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" >
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                />
            </PopoverContent>
        </Popover>
    )
}