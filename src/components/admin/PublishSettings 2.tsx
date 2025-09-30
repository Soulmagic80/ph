"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { createClient } from "@/lib/supabase/client";
import { RiResetLeftLine } from "@remixicon/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminSettings {
    id: string;
    weekly_publish_limit: number;
    publish_strategy: string;
    created_at: string;
    updated_at: string;
}

interface PublishSettingsProps {
    onSettingsChange?: (settings: AdminSettings) => void;
}

export function PublishSettings({ onSettingsChange }: PublishSettingsProps) {
    const [settings, setSettings] = useState<AdminSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Local form state
    const [weeklyLimit, setWeeklyLimit] = useState<number>(5);
    const [cronJobEnabled, setCronJobEnabled] = useState<boolean>(true);
    const [strategy, setStrategy] = useState<'oldest_first' | 'newest_first'>('oldest_first');
    const [initialWeeklyLimit, setInitialWeeklyLimit] = useState<number>(5);
    const [initialCronJobEnabled, setInitialCronJobEnabled] = useState<boolean>(true);

    // Fetch current settings
    const fetchSettings = useCallback(async () => {
        try {
            setIsLoading(true);
            const supabase = createClient();

            const { data, error } = await supabase
                .from('admin_settings')
                .select('*')
                .single();

            if (error) {
                console.error('Error fetching admin settings:', error);
                toast.error('Failed to load settings');
                return;
            }

            setSettings(data);
            // Update local form state
            setWeeklyLimit(data.weekly_publish_limit);
            setInitialWeeklyLimit(data.weekly_publish_limit);

            // Convert strategy to cronJob enabled/disabled
            const isEnabled = data.publish_strategy !== 'manual';
            setCronJobEnabled(isEnabled);
            setInitialCronJobEnabled(isEnabled);

            // Set strategy (only FIFO/LIFO, default to FIFO if manual)
            const strategyValue = data.publish_strategy === 'manual' ? 'oldest_first' : data.publish_strategy;
            setStrategy(strategyValue as 'oldest_first' | 'newest_first');

            onSettingsChange?.(data);
        } catch (error) {
            console.error('Error fetching admin settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    }, [onSettingsChange]);

    // Save settings
    const handleSaveSettings = async () => {
        if (!settings) return;

        try {
            setIsSaving(true);
            const supabase = createClient();

            // Convert cronJob enabled/disabled back to strategy
            const publishStrategy = cronJobEnabled ? strategy : 'manual';

            const newSettings = {
                weekly_publish_limit: weeklyLimit,
                publish_strategy: publishStrategy,
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('admin_settings')
                .update(newSettings)
                .eq('id', settings.id)
                .select()
                .single();

            if (error) {
                throw new Error('Failed to update settings');
            }

            setSettings(data);
            onSettingsChange?.(data);
            toast.success('Settings updated successfully');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Failed to load settings
                </div>
            </div>
        );
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Math.max(5, Number(event.target.value)), 50);
        setWeeklyLimit(value);
    };

    const handleSliderChange = ([value]: number[]) => {
        setWeeklyLimit(value);
    };

    return (
        <div className="rounded-lg bg-gray-50/50 p-8 ring-1 ring-gray-200 dark:bg-[#090E1A] dark:ring-gray-800">
            <div className="flex w-full flex-col lg:flex-row lg:items-start gap-6">
                {/* Weekly Publish Limit Section */}
                <div className="flex-1 lg:max-w-96">
                    <Label
                        htmlFor="weekly-limit"
                        className="text-base font-medium sm:text-sm"
                    >
                        Weekly Publish Limit
                    </Label>
                    <div className="mt-2 flex items-center gap-4">
                        <Slider
                            value={[weeklyLimit]}
                            onValueChange={handleSliderChange}
                            min={1}
                            max={50}
                            step={1}
                            className="w-full sm:max-w-56"
                            disabled={!cronJobEnabled}
                        />
                        <label htmlFor="weekly-limit" className="sr-only">
                            Weekly Publish Limit
                        </label>
                        <Input
                            id="weekly-limit"
                            type="number"
                            value={weeklyLimit}
                            onChange={handleInputChange}
                            min={5}
                            max={50}
                            className="w-20 sm:w-16"
                            disabled={!cronJobEnabled}
                        />
                        {(weeklyLimit !== initialWeeklyLimit || cronJobEnabled !== initialCronJobEnabled) ? (
                            <Button
                                onClick={() => {
                                    setWeeklyLimit(initialWeeklyLimit);
                                    setCronJobEnabled(initialCronJobEnabled);
                                }}
                                variant="ghost"
                                className="group -ml-2.5 py-2.5 sm:py-2"
                            >
                                <RiResetLeftLine className="size-5 text-gray-500 transition group-hover:-rotate-45 group-hover:text-gray-700 dark:text-gray-500 group-hover:dark:text-gray-300" />
                                <span className="sr-only">Reset</span>
                            </Button>
                        ) : null}
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-sm tabular-nums">
                        <span className="text-gray-400 dark:text-gray-600">
                            Current: {initialWeeklyLimit}
                        </span>
                        <span className="text-gray-900 dark:text-gray-50">
                            Selected: {weeklyLimit}
                        </span>
                    </p>
                </div>

                {/* CronJob and Strategy Section */}
                <div className="flex-1 space-y-6">
                    {/* CronJob Toggle */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between max-w-xs">
                            <Label
                                htmlFor="cronjob-toggle"
                                className="text-base font-medium sm:text-sm"
                            >
                                CronJob
                            </Label>
                            <Switch
                                id="cronjob-toggle"
                                checked={cronJobEnabled}
                                onCheckedChange={setCronJobEnabled}
                            />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {cronJobEnabled ? 'Automatic publishing enabled' : 'Manual publishing only'}
                        </p>
                    </div>

                    {/* Publishing Strategy Toggle - only show when CronJob is enabled */}
                    {cronJobEnabled && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between max-w-xs">
                                <Label
                                    htmlFor="strategy-toggle"
                                    className="text-base font-medium sm:text-sm"
                                >
                                    Publishing Strategy
                                </Label>
                                <Switch
                                    id="strategy-toggle"
                                    checked={strategy === 'newest_first'}
                                    onCheckedChange={(checked) => setStrategy(checked ? 'newest_first' : 'oldest_first')}
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {strategy === 'newest_first' ? 'LIFO (Newest First)' : 'FIFO (Oldest First)'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Button */}
            <div className="w-full flex justify-end mt-6">
                <Button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="px-8 py-2"
                >
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
            </div>
        </div>
    );
}