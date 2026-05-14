import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SiteLayout } from "./layout/SiteLayout";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { PurchasePage } from "./pages/PurchasePage";
import { ResourcesPage } from "./pages/ResourcesPage";

export default function App() {
  const location = useLocation();

  return (
    <SiteLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recursos" element={<ResourcesPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/solicitar-demo" element={<PurchasePage />} />
          <Route path="/pagina_web_compra" element={<Navigate to="/solicitar-demo" replace />} />
        </Routes>
      </AnimatePresence>
    </SiteLayout>
  );
}
