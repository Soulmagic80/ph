import { use } from "react";
import PortfolioDetailContent from "./PortfolioDetailContent";

export default function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    return <PortfolioDetailContent slug={resolvedParams.slug} />;
} 