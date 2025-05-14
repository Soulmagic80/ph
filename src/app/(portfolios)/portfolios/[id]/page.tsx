import { use } from "react";
import PortfolioDetailContent from "./PortfolioDetailContent";

export default function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    return <PortfolioDetailContent id={resolvedParams.id} />;
} 