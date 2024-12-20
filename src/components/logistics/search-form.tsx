import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const formSchema = z.object({
	search: z.string().min(4, { message: "Search is required" }),
});

export function SearchForm({
	setQuerySearch,
	isLoading,
}: {
	setQuerySearch: (query: string) => void;
	isLoading: boolean;
}) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			search: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setQuerySearch(values.search); // Pass the search term to the parent component
	}

	return (
		<div className=" bg-muted/20  rounded-lg py-6 px-4 ">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="grid grid-cols-1 md:flex  md:mx-0 md:flex-row items-center gap-2 md:gap-4 "
				>
					<FormField
						control={form.control}
						name="search"
						disabled={isLoading}
						
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="relative ml-auto flex-1 md:grow-0">
										<Search className="absolute left-2.5 top-[12px] h-4 w-4 text-muted-foreground" />
										<Input
											type="search"
											placeholder="Buscar..."
											className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
											{...field}
										/>
										{isLoading && (
											<div className="absolute right-2.5 top-[12px]">
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
											</div>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	);
}
