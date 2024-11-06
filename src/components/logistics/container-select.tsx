import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "../ui/skeleton";

interface Container {
	id: string;
	name: string;
	// Add other container properties as needed
}

const fetchContainers = async (): Promise<Container[]> => {
	const response = await fetch("http://localhost:3001/api/containers/");
	if (!response.ok) {
		throw new Error("Failed to fetch containers");
	}
	return response.json();
};

export const ContainerSelect = ({
	setSelectedContainer,
}: {
	setSelectedContainer: (container: any) => void;
}) => {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");

	const {
		data: containers = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["containers"],
		queryFn: fetchContainers,

		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	if (error) {
		return <div>Error loading containers</div>;
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[300px] justify-between"
				>
					{value ? (
						containers.find((container) => container.id === value)?.name + " - " + value
					) : isLoading ? (
						<Skeleton className="h-4 w-full" />
					) : (
						"Contenedores..."
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[300px] p-0">
				<Command>
					<CommandInput placeholder="Search Contenedor..." />
					<CommandList>
						<CommandEmpty>No containers found.</CommandEmpty>
						<CommandGroup>
							{containers.map((container) => (
								<CommandItem
									key={container.id}
									value={container.id}
									onSelect={() => {
										setValue(container.id);
										setSelectedContainer(container);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === container.id ? "opacity-100" : "opacity-0",
										)}
									/>
									{container.name + " - " + container.id}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};