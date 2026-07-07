interface HeaderProps {
    title: string;
    count?: number;
}

export default function Header({ title, count }: HeaderProps) {
    return (
        <header>
            <h1>{title}</h1>
            {count !== undefined && (
                <span data-testid="count-badge">{count}</span>
            )}
        </header>
    );
}
