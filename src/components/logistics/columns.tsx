import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format, differenceInDays } from "date-fns";
import { ArrowUpDown, CheckCircle2, FileTextIcon, Tag, TimerIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ParcelInterface } from "@/interfaces/parcel";
import { Link } from "react-router-dom";
import ParcelHistorySheet from "./parcel-history-sheet";
import { Button } from "../ui/button";

export const columns: ColumnDef<ParcelInterface>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "agency",
		header: "Agencia",
		cell: ({ row }) => (
			<div className="space-y-1">
				<p className="font-medium text-sm text-sky-800">{row.original?.agency}</p>
			</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "invoiceId",
		header: "Factura",
		cell: ({ row }) => (
			<div className="w-40 space-y-1">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								to={`https://systemcaribetravel.com/ordenes/factura_print.php?id=${row.original.invoiceId}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 "
							>
								<FileTextIcon size={16} className="h-4 w-4 text-sky-700" />
								{row.original.invoiceId}
							</Link>
						</TooltipTrigger>
						<TooltipContent>
							<p>Ver Factura</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<p className="text-xs text-muted-foreground ">
					{row.original?.invoiceDate &&
						format(new Date(row.original?.invoiceDate), "dd/MM/yyyy h:mm a")}
				</p>
			</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "hbl",
		header: "Hbl",
		cell: ({ row }) => (
			<div className="space-y-1">
				<div className="flex items-center gap-3">
					<span>{row.original?.hbl}</span>{" "}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									to={`https://systemcaribetravel.com/ordenes/etiqueta_print_transcargo.php?id=${row.original?.invoiceId}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 "
								>
									<Tag size={16} className="h-4 w-4 text-sky-700" />
								</Link>
							</TooltipTrigger>
							<TooltipContent>
								<p>Ver Etiquetas</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				<p className="text-xs text-muted-foreground">{row.original?.description}</p>
			</div>
		),
		enableSorting: true,
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<TooltipProvider>
				<div className="flex items-center gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<ParcelHistorySheet hbl={row.original?.hbl} />
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>History</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</TooltipProvider>
		),
	},
	{
		accessorKey: "locationName",
		header: "Location",
		cell: ({ row }) => {
			return (
				<span className="text-sm ">
					{row?.original?.container
						? row.original?.locationName + " - " + row?.original?.container
						: row.original?.locationName}
				</span>
			);
		},
		enableSorting: true,
	},

	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Status
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},

		cell: ({ row }) => {
			return (
				<div>
					{row.original?.status} {row.original?.statusDetails}
				</div>
			);
		},
		enableSorting: true,
	},

	{
		accessorKey: "updatedAt",
		header: "Actualizado",
		cell: ({ row }) => {
			const daysDifference = differenceInDays(
				row.original?.status === "ENTREGADO" ? new Date(row.original?.updatedAt) : new Date(), // Use current date if not ENTREGADO
				new Date(row.original?.invoiceDate),
			);
			return (
				<div className="w-40 flex flex-col items-center gap-1">
					{row.original?.locationName == "Entregado" ? (
						<div className="inline-flex justify-center items-center gap-1 mt-1">
							<CheckCircle2 className="h-4 w-4 col-span-1 text-green-500" />
							<p className=" col-span-2">Entregado en {daysDifference} días </p>
						</div>
					) : (
						<div className="inline-flex  justify-center items-center gap-1 mt-1">
							<TimerIcon
								className={`h-4 w-4 col-span-1 ${
									daysDifference < 10
										? "text-blue-500"
										: daysDifference < 20
										? "text-yellow-500"
										: "text-red-500"
								}`}
							/>
							<p className="col-span-2">{daysDifference} días desde Factura </p>
						</div>
					)}
					<p className="text-xs flex items-center  text-muted-foreground  ">
						{row.original?.updatedAt &&
							format(new Date(row.original?.updatedAt), "dd/MM/yyyy h:mm a")}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: "weight",
		header: "Peso",
		cell: ({ row }) => <span className="font-light">{row.original?.weight} Lbs</span>,
	},
	{
		accessorKey: "sender",
		header: "Envia",
		cell: ({ row }) => (
			<div className="flex items-center space-x-2">
				<Avatar className="h-8  w-8">
					<AvatarFallback>{row.original?.sender?.charAt(0)}</AvatarFallback>
				</Avatar>
				<span>{row.original?.sender}</span>
			</div>
		),
	},
	{
		accessorKey: "receiver",
		header: "Recibe",
		cell: ({ row }) => (
			<div className="flex items-center space-x-2">
				<Avatar className="h-8 w-8">
					<AvatarFallback>{row.original?.receiver?.charAt(0)}</AvatarFallback>
				</Avatar>
				<span>{row.original?.receiver}</span>
			</div>
		),
	},
	{
		accessorKey: "province",
		header: "Provincia",
		cell: ({ row }) => <span className="text-slate-600">{row.original?.province}</span>,
	},
	{
		accessorKey: "city",
		header: "Municipio",
		cell: ({ row }) => <span className="text-slate-600">{row.original?.city}</span>,
	},
];