import {cssBundleHref} from "@remix-run/css-bundle";
import {json, LinksFunction, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation,} from "@remix-run/react";

import {getUser} from "~/session.server";
import stylesheet from "~/tailwind.css";
import {isProtectedRoute, protectedRouteIds} from "~/utils";
import Navbar from "~/components/Navbar";

export const links: LinksFunction = () => [
    {rel: "stylesheet", href: stylesheet},
    ...(cssBundleHref ? [{rel: "stylesheet", href: cssBundleHref}] : []),
];

export const loader = async ({request}: LoaderFunctionArgs) => {
    const user = await getUser(request);
    const url = new URL(request.url);
    if (!user && isProtectedRoute(url.pathname)) {
        return redirect('/login');
    }
    console.log('user', user)
    return json({user: user});
};

export default function App() {
    const location = useLocation();
    return (
        <html lang="en" className="h-full">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body className="h-full">
        {protectedRouteIds.includes(location.pathname) && <Navbar/>}
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
