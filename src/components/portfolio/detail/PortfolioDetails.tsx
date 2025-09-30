import { Badge } from "@/components/ui/Badge";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { ToolName } from "@/lib/toolIcons";
import { PortfolioWithRelations } from "@/types";

interface PortfolioDetailsProps {
    portfolio: PortfolioWithRelations;
}

// Helper component for badge lists
function BadgeList({
    items,
    variant = "default",
    renderItem
}: {
    items: any[] | null;
    variant?: "default" | "warning" | "success";
    renderItem: (item: any) => string;
}) {
    if (!items || items.length === 0) {
        return <span className="text-gray-500 dark:text-gray-400">n.a.</span>;
    }

    return (
        <div className="flex flex-row flex-wrap justify-end gap-2">
            {items.map((item, index) => {
                try {
                    const renderedItem = renderItem(item);
                    if (!renderedItem) return null;

                    return (
                        <Badge key={`${renderedItem}-${index}`} variant={variant}>
                            {renderedItem}
                        </Badge>
                    );
                } catch (error) {
                    console.warn('Error rendering badge item:', error, item);
                    return null;
                }
            })}
        </div>
    );
}

// Helper component for tool badges
function ToolBadgeList({ tools }: { tools: any[] | null }) {

    if (!tools || tools.length === 0) {
        return <span className="text-gray-500 dark:text-gray-400">n.a.</span>;
    }

    return (
        <div className="flex flex-row flex-wrap justify-end gap-2">
            {tools.map((toolItem, index) => {
                try {
                    if (!toolItem?.tool?.name) {
                        return null;
                    }

                    return (
                        <ToolBadge
                            key={`${toolItem.tool.name}-${index}`}
                            tool={toolItem.tool.name as ToolName}
                        />
                    );
                } catch (error) {
                    console.warn('Error rendering tool badge:', error, toolItem);
                    return null;
                }
            })}
        </div>
    );
}

// Helper component for table rows
function DetailRow({
    label,
    children
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <tr>
            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                {label}
            </td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-50 text-right">
                {children}
            </td>
        </tr>
    );
}

export default function PortfolioDetails({ portfolio }: PortfolioDetailsProps) {

    // Format date
    const formattedDate = new Date(portfolio.created_at).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
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
                                <th scope="col" className="border-b px-4 py-3.5 text-left text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 text-xs font-medium uppercase">
                                    Category
                                </th>
                                <th scope="col" className="border-b px-4 py-3.5 text-right text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-800 text-xs font-medium uppercase">

                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            <DetailRow label="Designer or Agency">
                                {portfolio.title}
                            </DetailRow>

                            <DetailRow label="Portfolio style">
                                <BadgeList
                                    items={portfolio.style || null}
                                    variant="warning"
                                    renderItem={(item) => item}
                                />
                            </DetailRow>

                            <DetailRow label="Tools">
                                <ToolBadgeList tools={portfolio.tools} />
                            </DetailRow>

                            <DetailRow label="Ranking (All time)">
                                #{portfolio.current_rank || 'N/A'}
                            </DetailRow>

                            <DetailRow label="Upvotes">
                                {portfolio.upvote_count || 0}
                            </DetailRow>

                            <DetailRow label="Upload date">
                                {formattedDate}
                            </DetailRow>

                            <DetailRow label="Tags">
                                <BadgeList
                                    items={portfolio.tags || null}
                                    renderItem={(item) => item}
                                />
                            </DetailRow>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
} 