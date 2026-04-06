import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Lazy loading components
const Index = lazy(() => import("./pages/Index.tsx"));
const JuegosDigitales = lazy(() => import("./pages/JuegosDigitales.tsx"));
const GamePassCatalog = lazy(() => import("./pages/GamePassCatalog.tsx"));
const Consolas = lazy(() => import("./pages/Consolas.tsx"));
const AdminApp = lazy(() => import("./admin/AdminApp.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
    <div className="w-10 h-10 border-4 border-t-sky-500 border-sky-900/20 rounded-full animate-spin" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingPage />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/juegos-digitales" element={<JuegosDigitales />} />
              <Route path="/game-pass" element={<GamePassCatalog />} />
              <Route path="/consolas" element={<Consolas />} />
              <Route path="/paneladmin/*" element={<AdminApp />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
