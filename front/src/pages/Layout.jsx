import { Outlet } from 'react-router-dom';
import Header from '@/components/commons/Header.jsx';
import Footer from '@/components/commons/Footer.jsx';

export default function Layout() {
  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
    </>
  );
}
