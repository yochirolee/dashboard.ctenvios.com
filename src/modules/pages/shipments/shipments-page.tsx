import { ShipmentsTable } from "../../components/shipments/shipments-table";

import { useGetShipments, useSearchShipments } from "@/hooks/use-shipments";
import { ShipmentSearchForm } from "../../components/shipments/shipment-search-form";
import { useState } from "react";
import { ShipmentTableSkeleton } from "../../components/shipments/shipment-table-skeleton";
import {} from "../../components/shipments/shipment-actions-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShipmentColumns } from "@/modules/components/shipments/shipments-columns";
import ShipmentsExcelUploadDialog from "@/modules/components/shipments/shipments-excel-upload-dialog";

export default function ShipmentsPage() {
	const { data, isLoading, error } = useGetShipments();
	const [querySearch, setQuerySearch] = useState("");
	const {
		data: searchData,
		isLoading: searchLoading,
		error: searchError,
	} = useSearchShipments({
		query: querySearch,
	});

	// if querySearch is empty, show all shipments

	return (
		<div className="flex flex-col gap-4">
			<div className="md:flex justify-between items-center  bg-muted/20  rounded-lg py-6 px-4">
				<ShipmentSearchForm setQuerySearch={setQuerySearch} isLoading={searchLoading} />
				<ShipmentsExcelUploadDialog isLoading={searchLoading} />
			</div>
			{isLoading ? (
				<ShipmentTableSkeleton />
			) : error || searchError ? (
				<Alert variant="destructive">
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>Error loading shipments, please try again later</AlertDescription>
				</Alert>
			) : (
				<ShipmentsTable
					data={querySearch ? searchData?.shipments : data?.shipments}
					columns={ShipmentColumns()}
				/>
			)}
		</div>
	);
}
