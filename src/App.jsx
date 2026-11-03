import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import NewsletterWidget from '@/components/newsletter/NewsletterWidget';
import Home from '@/pages/Home';
import Chiedimelo from '@/pages/Chiedimelo';

// Il widget newsletter non compare sulla landing a pagamento.
function Newsletter() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/chiedimelo')) return null;
  return <NewsletterWidget />;
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chiedimelo" element={<Chiedimelo />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Newsletter />
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
