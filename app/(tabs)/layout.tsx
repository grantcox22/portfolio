import AppContainer from "./_components/app-container";

export default function TabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppContainer>{children}</AppContainer>;
}
