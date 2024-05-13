type HeaderProps = {
    title: React.ReactNode;
    description?: string;
    children?: React.ReactNode;
}
export default function Header({title, description, children}: HeaderProps) {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>{title}</h1>
                {children}
            </div>
            {description && <p>{description}</p>}
            <hr className='border border-skyWave'/>
        </div>
    )
}