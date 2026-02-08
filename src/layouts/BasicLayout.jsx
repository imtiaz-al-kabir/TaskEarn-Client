import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function BasicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-brand-500/30">
      <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-[1]"></div>
      <Navbar />
      <main className="flex-1 relative z-10 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
