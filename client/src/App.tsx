import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/home";
import IBOBuilder from "@/pages/ibo-builder";
import CardComposer from "@/pages/card-composer-fixed";
import Sessions from "@/pages/sessions";
import SessionBuilder from "@/pages/session-builder";
import Export from "@/pages/export";
import Dashboard from "@/pages/dashboard";
import SupabaseTest from "@/pages/supabase-test";
import TypesTest from "@/pages/types-test";
import IBOTest from "@/pages/ibo-test";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ibos" element={<IBOBuilder />} />
              <Route path="/cards" element={<CardComposer />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/session-builder" element={<SessionBuilder />} />
              <Route path="/export" element={<Export />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/supabase-test" element={<SupabaseTest />} />
              <Route path="/types-test" element={<TypesTest />} />
              <Route path="/ibo-test" element={<IBOTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
