import './globals.css';

export const metadata = {
  title: 'RESUMETAI',
  description: 'AI interview and career intelligence platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
