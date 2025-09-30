interface PortfolioErrorProps {
    message: string;
}

export function PortfolioError({ message }: PortfolioErrorProps) {
    return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{message}</p>
        </div>
    );
} 