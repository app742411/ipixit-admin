import { useState, useEffect, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import toast from "react-hot-toast";

import { createSubadmin, updateSubadmin, getSubadmins, deleteSubadmin } from "../../api/subadminApi";
import SubadminList from "../../components/rolespermission/SubadminList";
import SubadminForm from "../../components/rolespermission/SubadminForm";

export default function RolesPermissionManage() {
    const [subadmins, setSubadmins] = useState([]);
    const [loading, setLoading] = useState(false);

    // View modes: 'list' | 'create' | 'edit'
    const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
    const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    const fetchSubadmins = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getSubadmins();
            // Using flexible accessor for response data array 
            const data = (res.data as any)?.data || (res.data as any)?.admin || res.data || [];
            const arrayData = Array.isArray(data) ? data : (data?.subadmins ? data.subadmins : []);
            setSubadmins(arrayData);
        } catch (error) {
            console.error("Failed to fetch subadmins:", error);
            // Ignore error toast if the endpoint isn't fully set up yet
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (viewMode === 'list') {
            fetchSubadmins();
        }
    }, [viewMode, fetchSubadmins]);

    const handleCreateClick = () => {
        setSelectedAdmin(null);
        setViewMode('create');
    };

    const handleEditClick = (admin: any) => {
        setSelectedAdmin(admin);
        setViewMode('edit');
    };

    const handleCancel = () => {
        setViewMode('list');
        setSelectedAdmin(null);
    };

    const handleSubmit = async (data: any) => {
        try {
            setFormLoading(true);
            if (viewMode === 'edit' && selectedAdmin) {
                const id = selectedAdmin._id || selectedAdmin.id;
                await updateSubadmin(id, data);
                toast.success("Subadmin updated successfully");
            } else if (viewMode === 'create') {
                await createSubadmin(data);
                toast.success("Subadmin created successfully");
            }
            setViewMode('list');
            fetchSubadmins();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteSubadmin(id);
            toast.success("Subadmin deleted successfully");
            fetchSubadmins();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete subadmin.");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <PageMeta title="Roles & Permissions" />
            <PageBreadcrumb pageTitle="Roles & Permissions" />

            {viewMode === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Subadmins</h2>
                        <Button onClick={handleCreateClick}>+ Create Subadmin</Button>
                    </div>
                    <SubadminList
                        subadmins={subadmins}
                        loading={loading}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                    />
                </>
            )}

            {viewMode === 'create' && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="mb-5 text-lg font-bold text-gray-800 dark:text-white/90">Create New Subadmin</h3>
                    <SubadminForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={formLoading}
                    />
                </div>
            )}

            {viewMode === 'edit' && selectedAdmin && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
                    <h3 className="mb-5 text-lg font-bold text-gray-800 dark:text-white/90">Edit Subadmin Focus</h3>
                    <SubadminForm
                        initialData={selectedAdmin}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={formLoading}
                    />
                </div>
            )}
        </div>
    );
}
