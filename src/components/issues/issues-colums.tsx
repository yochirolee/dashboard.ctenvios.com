import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { format, differenceInDays } from "date-fns";
import { ArrowUpDown, CheckCircle2, FileTextIcon, Flame, Tag, TimerIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ParcelInterface } from "@/interfaces/parcel";
import { Link } from "react-router-dom";
import ParcelHistorySheet from "@/components/logistics/parcel-history-sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statuses } from "@/data/data";

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
				<p className="font-medium text-xs md:text-sm text-sky-800">{row.original?.agency}</p>
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
		accessorKey: "location",
		header: "Location",
		cell: ({ row }) => {
			return (
				<div className="flex flex-col space-y-2">
					<span className="text-xs text-nowrap">
						{row?.original?.container
							? row.original?.location + " - " + row?.original?.container
							: row.original?.location}
					</span>
					{row.original?.statusDetails && (
						<span className="text-xs text-muted-foreground">{row.original.statusDetails}</span>
					)}
				</div>
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
				<div className="flex flex-col text-nowrap items-center gap-2">
					<Badge
						variant="outline"
						className={`px-3 py-1 text-nowrap rounded-full text-xs font-medium inline-flex items-center gap-1`}
					>
						{statuses.find((status) => status.value === row.original?.status)?.label}
					</Badge>
					<p className="text-xs flex items-center  text-muted-foreground  ">
						{row.original?.updatedAt &&
							format(new Date(row.original?.updatedAt), "dd/MM/yyyy h:mm a")}
					</p>
				</div>
			);
		},
		enableSorting: true,
	},

	{
		accessorKey: "updatedAt",
		header: "Days",
		cell: ({ row }) => {
			const daysDifference = differenceInDays(
				row.original?.status === "ENTREGADO" ? new Date(row.original?.updatedAt) : new Date(), // Use current date if not ENTREGADO
				new Date(row.original?.invoiceDate),
			);
			const daysDifferenceFromLastStatus = differenceInDays(
				new Date(),
				new Date(row.original?.updatedAt),
			);
			return (
				<div className="w-48 flex  justify-between items-center gap-1">
					<div className="flex flex-1 flex-col  items-start text-nowrap  ">
						{row.original?.location == "Entregado" ? (
							<div className=" inline-flex items-center gap-2">
								<CheckCircle2 className="h-4 w-4  text-green-500" />
								<p>Entregado {daysDifference} días </p>
							</div>
						) : (
							<div className="flex flex-col items-start gap-1">
								<div className="inline-flex  justify-left items-center gap-1 mt-1">
									<TimerIcon
										className={`h-4 w-4 col-span-1 ${
											daysDifference < 10
												? "text-blue-500"
												: daysDifference < 20
												? "text-yellow-500"
												: "text-red-500"
										}`}
									/>
									<p className="col-span-2">Total: {daysDifference} días </p>
								</div>
								<div className="inline-flex  justify-center items-center gap-1 mt-1">
									<p className=" text-xs text-muted-foreground">
										{daysDifferenceFromLastStatus} días {row.original?.status}
									</p>
								</div>
							</div>
						)}
					</div>
					<TooltipProvider>
						<div className="flex items-center  gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="relative">
										<Button variant="ghost" size="icon">
											<Flame className="  text-muted-foreground" />
										</Button>

										{/* <div className="absolute -top-3 -right-3">
											<Badge
												variant="destructive"
												className="rounded-full h-4 w-4 text-[12px] p-1 mx-auto flex items-center justify-center"
											>
												2
											</Badge>
										</div> */}
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p>Reclamar</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</TooltipProvider>
				</div>
			);
		},
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
