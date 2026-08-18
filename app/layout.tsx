import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import "./portal-update.css";
import "./mobile.css";
import "./terms.css";
export const metadata:Metadata={
  title:"Pacifica Legal Insurance",
  description:"Legal protection, handled with confidence.",
  icons:{icon:"/icon.png",shortcut:"/icon.png",apple:"/icon.png"}
};
export const viewport:Viewport={width:"device-width",initialScale:1,viewportFit:"cover"};
export default function RootLayout({children}:{children:React.ReactNode}){return <ClerkProvider><html lang="en"><body>{children}</body></html></ClerkProvider>}
