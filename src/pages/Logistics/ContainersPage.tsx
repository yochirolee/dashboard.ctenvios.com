import { columns } from "@/components/common/table/columns";
import { ContainerSelect } from "@/components/containers/container-select";
import { DataTable } from "@/components/common/table/data-table";
import { useFetchParcelsByContainerId } from "@/hooks/parcels/containers";

import { useState } from "react";
import TableSkeleton from "@/components/logistics/table-skeleton";
import { ContainerStats } from "@/components/containers/container-stats";
import {
	NoContainerSelected,
	ContainerPendingToArrival,
} from "@/components/containers/no-container-selected";
import { ContainerUpdateModalForm } from "@/components/containers/container-update-modal-form";
import ExcelUploadDialog from "@/components/logistics/excel-upload-dialog";

export default function ContainersPage() {
	const [selectedContainer, setSelectedContainer] = useState<number | null>(null);
	const {
		data: parcelsInContainer,
		isLoading,
		error,
	} = useFetchParcelsByContainerId(selectedContainer?.id);

	return (
		<div className="p-2 md:p-4">
			<div className=" bg-muted/20   rounded-md my-2 md:py-6  md:px-4 gap-4  grid md:flex justify-center md:justify-between items-center   ">
				<ContainerSelect setSelectedContainer={setSelectedContainer} />
				<div className="flex flex-col justify-end ">
					<div className="grid grid-cols-2 lg:flex  mx-auto items-center md:gap-4 gap-2">
						<ContainerUpdateModalForm
							selectedContainerId={selectedContainer?.id}
							inPort={parcelsInContainer?.inPort}
						/>
						<ExcelUploadDialog isLoading={isLoading} />
					</div>
				</div>
			</div>

			{selectedContainer?.id ? (
				<div>
					{isLoading ? (
						<TableSkeleton />
					) : (
						<div>
							{parcelsInContainer?.inPort ? (
								<ContainerStats parcelsInContainer={parcelsInContainer?.data} />
							) : (
								<ContainerPendingToArrival selectedContainerId={selectedContainer?.id} />
							)}
							<DataTable columns={columns} data={parcelsInContainer?.data || []} />
						</div>
					)}
				</div>
			) : (
				<NoContainerSelected />
			)}
		</div>
	);
}
