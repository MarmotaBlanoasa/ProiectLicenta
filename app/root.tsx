import {cssBundleHref} from "@remix-run/css-bundle";
import {json, LinksFunction, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLocation,} from "@remix-run/react";

import {getUser} from "~/session.server";
import stylesheet from "~/tailwind.css";
import {isProtectedRoute, protectedRouteIds} from "~/utils";
import Navbar from "~/components/Navbar";
import {getCashBankBalance} from "~/models/user.server";

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
    const cashBankBalance = await getCashBankBalance(user?.id || '');
    const userInformation = {
        ...user,
        bankBalance: cashBankBalance?.bank?.balance || 0,
        cashBankBalance: cashBankBalance?.cash?.balance || 0,
    }
    return json({user: userInformation});
};

export default function App() {
    const location = useLocation();
    const match = '/' + location.pathname.split('/')[1];
    return (
        <html lang="en" className="h-full">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body className="h-fulls">
        {protectedRouteIds.includes(match) && <Navbar/>}
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
