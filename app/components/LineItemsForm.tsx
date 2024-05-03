import {Input} from "~/components/ui/ui/input";
import {Button} from "~/components/ui/ui/button";

export default function LineItemsForm({lineItems, register, setValue, errors}: { lineItems: { description: string, quantity: number|null, price: number|null }[], register: any, setValue: any, errors: any}) {
    return (
        <div>
            <div className='flex flex-col gap-4 items-start pt-2'>
                {lineItems.map((item, index) => (
                    <div className='flex gap-4' key={index}>
                        <Input type='text'  {...register(`lineItems.${index}.description`)}
                               defaultValue={item.description}
                               id={`lineItems.${index}.description`} placeholder='Description'/>
                        <Input type='number' defaultValue={item.quantity || undefined}
                               onBlur={(e) => setValue(`lineItems.${index}.quantity`, Number(e.target.value))}
                               id={`lineItems.${index}.quantity`} placeholder='Quantity'/>
                        <Input type='number' defaultValue={item.price || undefined}
                               onBlur={(e) => {
                                   setValue(`lineItems.${index}.price`, Number(e.target.value))
                               }}
                               id={`lineItems.${index}.price`} placeholder='Price'/>
                        {index > 0 && <Button variant='link' type='button'
                                              onClick={() => setValue('lineItems', lineItems.filter((_, i) => i !== index))}>Remove</Button>}
                    </div>
                ))}
                {errors.lineItems && <p className='text-red-500'>{errors.lineItems.message}</p>}
                <Button variant='link' type='button' onClick={() => setValue('lineItems', [...lineItems, {
                    description: '',
                    quantity: null,
                    price: null
                }])}>+ Add new Service or Item</Button>
            </div>
        </div>
    )
}