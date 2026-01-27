"use client";

import { useEffect, useState, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { getCommissionApi, updateCommissionApi, CommissionData } from "../../api/commissionApi";

export default function CommissionManage() {
    const [commission, setCommission] = useState<CommissionData>({
        requestPurchaseCommission: { type: "percentage", value: 0 },
        directPurchaseCommission: { type: "fixed", value: 0 },
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const fetchCommission = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getCommissionApi();
            if (res.data && res.data.data) {
                setCommission({
                    requestPurchaseCommission: res.data.data.requestPurchaseCommission,
                    directPurchaseCommission: res.data.data.directPurchaseCommission,
                });
            }
        } catch (error) {
            console.error("Failed to fetch commission:", error);
            setMessage({ type: "error", text: "Failed to load commission settings." });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCommission();
    }, [fetchCommission]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage(null);
            await updateCommissionApi(commission);
            setMessage({ type: "success", text: "Commission settings updated successfully!" });
        } catch (error) {
            console.error("Failed to update commission:", error);
            setMessage({ type: "error", text: "Failed to update commission settings." });
        } finally {
            setSaving(false);
        }
    };

    const handleTypeChange = (key: keyof CommissionData, type: "percentage" | "fixed") => {
        setCommission((prev) => ({
            ...prev,
            [key]: { ...prev[key], type },
        }));
    };

    const handleValueChange = (key: keyof CommissionData, value: number) => {
        setCommission((prev) => ({
            ...prev,
            [key]: { ...prev[key], value },
        }));
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div>
            <PageMeta title="Commission Management" />
            <PageBreadcrumb pageTitle="Commission Management" />

            <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Commission Settings
                </h2>

                {message && (
                    <div
                        className={`mb-6 rounded-lg p-4 ${message.type === "success"
                                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Request Purchase Commission */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Request Purchase Commission
                            </h3>
                            <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Type
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                                        value={commission.requestPurchaseCommission.type}
                                        onChange={(e) => handleTypeChange("requestPurchaseCommission", e.target.value as "percentage" | "fixed")}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Value
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                                        value={commission.requestPurchaseCommission.value}
                                        onChange={(e) => handleValueChange("requestPurchaseCommission", parseFloat(e.target.value))}
                                        placeholder="Enter commission value"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Direct Purchase Commission */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Direct Purchase Commission
                            </h3>
                            <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Type
                                    </label>
                                    <select
                                        className="w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                                        value={commission.directPurchaseCommission.type}
                                        onChange={(e) => handleTypeChange("directPurchaseCommission", e.target.value as "percentage" | "fixed")}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Value
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full rounded-lg border bg-white p-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                                        value={commission.directPurchaseCommission.value}
                                        onChange={(e) => handleValueChange("directPurchaseCommission", parseFloat(e.target.value))}
                                        placeholder="Enter commission value"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
