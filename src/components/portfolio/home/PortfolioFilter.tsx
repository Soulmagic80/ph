import { ButtonTabs } from "@/components/ui/ButtonTabs";

interface PortfolioFilterProps {
    selectedRanking: 'week' | 'month' | 'all_time';
    onFilterChange: (ranking: 'week' | 'month' | 'all_time') => void;
}

export function PortfolioFilter({ selectedRanking, onFilterChange }: PortfolioFilterProps) {
    const tabs = [
        { id: 'week', label: 'Week' },
        { id: 'month', label: 'Month' },
        { id: 'all_time', label: 'All Time' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8 items-center">
            <div>
                <h2 className="scroll-mt-10 font-semibold text-supergrey-100 dark:text-gray-50 text-md">
                    Portfolio Rankings
                </h2>
                <p className="mt-0 text-base leading-6 text-gray-500">
                    Discover the best portfolios ranked by upvotes.
                </p>
            </div>
            <div className="md:pl-16 flex md:justify-end justify-start mt-4 md:mt-0">
                <ButtonTabs
                    tabs={tabs}
                    activeTab={selectedRanking}
                    onTabChange={(tabId: string) => onFilterChange(tabId as 'week' | 'month' | 'all_time')}
                    layoutId="home-ranking-tabs"
                />
            </div>
        </div>
    );
}