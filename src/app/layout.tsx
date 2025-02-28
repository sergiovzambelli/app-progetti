import "./globals.css";
import { Poppins } from "next/font/google";

// Configure the Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Specify the weights you need
  variable: "--font-poppins", //  Optional: Define a CSS variable
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${poppins.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
