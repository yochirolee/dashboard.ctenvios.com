import { tracking_api } from "@/api/parcels";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchIssues = () => {
	return useQuery<any[], Error>({
		queryKey: ["issues"],
		queryFn: () => tracking_api.issues.getAll(),
	});
};

/* export const useCreateIssue = () => {
	return useMutation({
		mutationFn: (values: any) => tracking_api.issues.create(values),
	});
};
 */