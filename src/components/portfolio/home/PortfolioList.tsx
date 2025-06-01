import { CalendarIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { Select, SelectItem } from "@tremor/react";
import { useState } from "react";

export function PortfolioList() {
    const [selectedRanking, setSelectedRanking] = useState("current_month");

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Portfolios</h1>
                <Select
                    value={selectedRanking}
                    onValueChange={setSelectedRanking}
                    className="w-[200px]"
                >
                    <SelectItem value="current_month" icon={CalendarIcon}>
                        Current month
                    </SelectItem>
                    <SelectItem value="all_time" icon={TrophyIcon}>
                        All time best
                    </SelectItem>
                </Select>
            </div>
        </div>
    );
} 