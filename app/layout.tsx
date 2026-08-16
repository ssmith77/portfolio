import './globals.css';

export const metadata = {
  title: "Task's",
  description: 'Savinon entity-aware task dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
