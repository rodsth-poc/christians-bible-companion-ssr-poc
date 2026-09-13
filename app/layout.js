export const metadata = {
  title: "Christians Bible Companion — SSR POC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
