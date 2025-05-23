import { Badge } from "@/components/ui/Badge";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { ToolName } from "@/lib/toolIcons";
import { PortfolioWithRelations } from "@/types";

interface PortfolioDetailsProps {
    portfolio: PortfolioWithRelations;
}

export default function PortfolioDetails({ portfolio }: PortfolioDetailsProps) {
    // Debug logging
    console.log('Portfolio in PortfolioDetails:', portfolio);
    console.log('Services in PortfolioDetails:', portfolio.services);
    console.log('Services structure:', JSON.stringify(portfolio.services, null, 2));

    // Format date
    const formattedDate = new Date(portfolio.created_at).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <>
            <section aria-labelledby="portfolio-details-heading">
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    {/* Left column: Title and subtitle */}
                    <div>
                        <h2
                            id="portfolio-details-heading"
                            className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                        >
                            Portfolio Details
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            View detailed information about this portfolio including upload date, upvotes, and tags.
                        </p>
                    </div>
                    {/* Right column: Content */}
                    <div className="md:col-span-2 md:pl-16">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th scope="col" className="border-b px-4 py-3.5 text-left text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 text-xs font-medium uppercase">Category</th>
                                    <th scope="col" className="border-b px-4 py-3.5 text-right text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 text-xs font-medium uppercase">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Designer or Agency</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">{portfolio.title}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Portfolio style</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">
                                        <div className="flex flex-row flex-wrap justify-end gap-2">
                                            {portfolio.style && portfolio.style.length > 0 ? (
                                                portfolio.style.map((styleItem, index) => (
                                                    <Badge key={index} variant="warning">{styleItem}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-gray-900 dark:text-gray-50">n.a.</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Services</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">
                                        <div className="flex flex-row flex-wrap justify-end gap-2">
                                            {portfolio.services && portfolio.services.length > 0 ? (
                                                portfolio.services.map((service, index) => (
                                                    <Badge key={index} variant="success">{service.service.name}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-gray-900 dark:text-gray-50">n.a.</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Tools</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">
                                        <div className="flex flex-row flex-wrap justify-end gap-2">
                                            {portfolio.tools && portfolio.tools.length > 0 ? (
                                                portfolio.tools.map((tool, index) => (
                                                    <ToolBadge key={index} tool={tool.tool.name as ToolName} />
                                                ))
                                            ) : (
                                                <span className="text-gray-900 dark:text-gray-50">n.a.</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Ranking (All time)</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">#{portfolio.rank_all_time || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Upvotes</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">{portfolio.upvotes || 0}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Upload date</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">{formattedDate}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">Tags</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">
                                        <div className="flex flex-row flex-wrap justify-end gap-2">
                                            {portfolio.tags && portfolio.tags.length > 0 ? (
                                                portfolio.tags.map((tag, index) => (
                                                    <Badge key={index}>{tag}</Badge>
                                                ))
                                            ) : (
                                                <span className="text-gray-900 dark:text-gray-50">n.a.</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
} 