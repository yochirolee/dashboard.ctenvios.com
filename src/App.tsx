import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/theme-context";
import AppRouter from "./router/AppRouter";
import { AuthProvider } from "./context/auth-context";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			refetchOnReconnect: true,
			retry: true,
		},
	},
});

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<Router>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<AppRouter />
					</AuthProvider>
				</QueryClientProvider>
			</Router>
		</ThemeProvider>
	);
}

export default App;
