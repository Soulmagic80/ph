import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { CalendarIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function PortfolioList() {
    const [selectedRanking, setSelectedRanking] = useState("current_month");

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Portfolios</h1>
                <Select value={selectedRanking} onValueChange={setSelectedRanking}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="current_month">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Current month
                        </SelectItem>
                        <SelectItem value="all_time">
                            <TrophyIcon className="w-4 h-4 mr-2" />
                            All time best
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
} 