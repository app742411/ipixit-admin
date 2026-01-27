import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ItemDetailsComp from "../../components/itemmanagement/Item_DetailsComp";
import { getItemById } from "../../api/itemApi";
import toast from "react-hot-toast";

const ItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await getItemById(id);
                if (response.data) {
                    setItem(response.data);
                } else {
                    toast.error("Item not found");
                    navigate("/item-management");
                }
            } catch (error) {
                console.error("Error fetching item details:", error);
                toast.error("Failed to load item details");
                navigate("/item-management");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id, navigate]);

    return (
        <div className="p-6 space-y-6">
            <PageMeta title={`Item Details - ${item?.title || ''}`} />
            <PageBreadcrumb pageTitle="Item Details" />

            {loading ? (
                <div className="flex h-96 items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
                </div>
            ) : item ? (
                <ItemDetailsComp item={item} />
            ) : (
                <div className="text-center py-20 text-gray-500">Item not found</div>
            )}
        </div>
    );
};

export default ItemDetails;
