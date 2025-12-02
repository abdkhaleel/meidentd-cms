import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-[70px] min-h-screen flex flex-col relative z-0">
        {children}
      </main>
      <Footer />
    </>
  );
}