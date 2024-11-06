import axios from "axios";
import { ParcelInterface } from "../interfaces/parcel";
const baseUrl =
	process.env.NODE_ENV === "production"
		? "https://apiv1trackingctenvioscom.vercel.app/api"
		: "http://localhost:3001/api";

// Parcels API

export const tracking_api = {
	parcels: {
		getAll: async (): Promise<ParcelInterface[]> => {
			const response = await axios.get(`${baseUrl}/parcels`);
			return response.data;
		},

		search: async (searchQuery: string): Promise<ParcelInterface[]> => {
			const response = await axios.get(`${baseUrl}/parcels/search`, {
				params: { q: searchQuery },
			});

			return response.data;
		},

		getByHbl: async (hbl: string): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/parcels/hbl/${hbl}`);
			return response.data;
		},
	},

	containers: {
		fetchContainers: async (): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/containers`);
			return response.data;
		},

		fetchParcelsByContainerId: async (containerId: number): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/containers/${containerId}/parcels`);
			return response.data;
		},
	},

	issues: {
		getAll: async (): Promise<any[]> => {
			const response = await axios.get(`${baseUrl}/issues`);
			return response.data;
		},
	},
};
