import { NextPage } from 'next';

interface ErrorProps {
    statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                    {statusCode ? `Error ${statusCode}` : 'An error occurred'}
                </h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {statusCode
                        ? `An error ${statusCode} occurred on server`
                        : 'An error occurred on client'}
                </p>
            </div>
        </div>
    );
};

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
