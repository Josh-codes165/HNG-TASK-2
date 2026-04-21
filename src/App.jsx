import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { InvoiceProvider } from "./context/InvoiceContext"
import Layout from "./components/Layout"
import InvoiceListPage from "./pages/InvoiceListPage"
import InvoiceDetailPage from "./pages/InvoiceDetailPage"
import InvoiceFormPage from "./pages/InvoiceFormPage"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <InvoiceProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/invoices" replace />} />
              <Route path="/invoices" element={<InvoiceListPage />} />
              <Route path="/invoices/new" element={<InvoiceFormPage />} />
              <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
              <Route path="/invoices/:id/edit" element={<InvoiceFormPage />} />
            </Routes>
          </Layout>
        </InvoiceProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App