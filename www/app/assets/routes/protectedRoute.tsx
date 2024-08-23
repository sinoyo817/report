import { createBrowserRouter } from "react-router-dom";
import routes from "~react-pages";

export const ProtectedRoutes = () => {
    const route = createBrowserRouter(routes);

    return route;
};
