import NavBar from "@/app/_components/NavBar";
import SyncProvider from "@/app/_components/SyncProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <SyncProvider>
        <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
          {children}
        </main>
      </SyncProvider>
    </div>
  );
}
