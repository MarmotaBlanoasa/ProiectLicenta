import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";
import {getUserId} from "~/session.server";
import {json} from "@remix-run/node";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}
export const useRouteData = (routeId: string) => {
  const matches = useMatches();
  const data = matches.find((match) => match.pathname === routeId)?.data;

  return data as any;
};

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export const protectedRouteIds = ["/dashboard", '/bills', '/clients','/vendors', '/expenses' ,'/invoices', '/profile', '/logout', '/payments'];
export function isProtectedRoute(route: string) {
    return protectedRouteIds.includes(route);
}
type PaymentMethod = { value: string; text: string; };
type PaymentMethodsMap = { [key: string]: string };
export const paymentMethods  = [
  { value: 'cash', text: 'Cash' },
  { value: 'bank_transfer', text: 'Bank Transfer' },
  { value: 'credit_card', text: 'Credit Card' },
  { value: 'debit_card', text: 'Debit Card' },
  { value: 'online_payment', text: 'Online Payment' },
  { value: 'mobile_payment', text: 'Mobile Payment' },
] as PaymentMethod[];
export const paymentMethodsMap = paymentMethods.reduce<PaymentMethodsMap>((acc, curr) => {
  acc[curr.value] = curr.text;
  return acc;
}, {});

export type AccountingAccountsType = { code: string; name: string; type: string; };
export const accountingAccounts: AccountingAccountsType[]  = [
  //BANI IN FIRMA
  {
    code: '5121', name: 'Conturi la banci in lei', type: 'Activ'
  },
  {
    code: '5311', name: 'Casa in lei', type: 'Activ'
  },
  //CREANTE DATORII
  {code: "4111", name: "Clienti", type: "Activ"},
  {code: "401", name: "Furnizori", type: "Pasiv"},
  //VENITURI
  {code: "701", name: "Venituri din prestări servicii", type: "Pasiv"},
  //CHELTUIELI
  {code: "602", name: "Cheltuieli cu materialele consumabile", type: "Activ"},
  {code: "6021", name: "Cheltuieli cu materialele auxiliare", type: "Activ"},
  {code: "6022", name: "Cheltuieli privind combustibilii", type: "Activ"},
  {code: "6023", name: "Cheltuieli privind materialele pentru ambalat", type: "Activ"},
  {code: "6024", name: "Cheltuieli privind piesele de schimb", type: "Activ"},
  {code: "6025", name: "Cheltuieli privind semintele si materialele de plantat", type: "Activ"},
  {code: "6026", name: "Cheltuieli privind furajele", type: "Activ"},
  {code: "6028", name: "Cheltuieli privind alte materiale consumabile", type: "Activ"},
  {code: "6051", name: "Cheltuieli privind consumul de energie", type: "Activ"},
  {code: "61", name: "Cheltuieli cu serviciile executate de terți", type: "Activ"},
  {code: "611", name: "Cheltuieli cu întreținerea și reparațiile", type: "Activ"},
  {code: "612", name: "Cheltuieli cu redeventele, locațiile de gestiune și chiriile", type: "Activ"},
  {code: "6121", name: "Cheltuieli cu redeventele", type: "Activ"},
  {code: "6122", name: "Cheltuieli cu locațiile de gestiune", type: "Activ"},
  {code: "6123", name: "Cheltuieli cu chiriile", type: "Activ"},
  {code: "613", name: "Cheltuieli cu primele de asigurare", type: "Activ"},
  {code: "614", name: "Cheltuieli cu studiile și cercetările", type: "Activ"},
  {code: "615", name: "Cheltuieli cu pregătirea personalului", type: "Activ"},
  {code: "616", name: "Cheltuieli aferente drepturilor de proprietate intelectuală", type: "Activ"},
  {code: "617", name: "Cheltuieli de management", type: "Activ"},
  {code: "618", name: "Cheltuieli de consultanță", type: "Activ"},
  {code: "62", name: "Cheltuieli cu alte servicii executate de terți", type: "Activ"},
  {code: "621", name: "Cheltuieli cu colaboratorii", type: "Activ"},
  {code: "622", name: "Cheltuieli privind comisioanele și onorariile", type: "Activ"},
  {code: "623", name: "Cheltuieli de protocol, reclamă și publicitate", type: "Activ"},
  {code: "6231", name: "Cheltuieli de protocol", type: "Activ"},
  {code: "6232", name: "Cheltuieli de reclamă și publicitate", type: "Activ"},
  {code: "624", name: "Cheltuieli cu transportul de bunuri și personal", type: "Activ"},
  {code: "625", name: "Cheltuieli cu deplasări, detașări și transferări", type: "Activ"},
  {code: "626", name: "Cheltuieli postale și taxe de telecomunicații", type: "Activ"},
  {code: "627", name: "Cheltuieli cu serviciile bancare și asimilate", type: "Activ"},
  {code: "628", name: "Alte cheltuieli cu serviciile executate de terți", type: "Activ"},
  //TVA
  {code: "4423", name: "TVA de plată", type: "Pasiv"},
  {code: "4424", name: "TVA de recuperat", type: "Activ"},
  {code: "4426", name: "TVA deductibilă", type: "Activ"},
  {code: "4427", name: "TVA colectată", type: "Pasiv"},
  {code: "4428", name: "TVA neexigibilă", type: "Activ/Pasiv"},
  //STOCURI
  {code: "302", name: "Materiale consumabile", type: "Activ"},
  {code: "3021", name: "Materiale auxiliare", type: "Activ"},
  {code: "3022", name: "Combustibili", type: "Activ"},
  {code: "3023", name: "Materiale pentru ambalat", type: "Activ"},
  {code: "3024", name: "Piese de schimb", type: "Activ"},
  {code: "3025", name: "Seminte si materiale de plantat", type: "Activ"},
  {code: "3026", name: "Furaje", type: "Activ"},
  {code: "3028", name: "Alte materiale consumabile", type: "Activ"}
];