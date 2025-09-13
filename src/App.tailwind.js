import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/pages/HomePage';
import Header from './components/layout/Header';

// Placeholder components for routes - to be implemented later
const TemplatesPage = () => <div className="p-8">Templates Page</div>;
const CreateResumePage = () => <div className="p-8">Create Resume Page</div>;
const TemplatePage = () => <div className="p-8">Individual Template Page</div>;
const BlogPage = () => <div className="p-8">Blog Page</div>;
const FaqPage = () => <div className="p-8">FAQ Page</div>;
const PricingPage = () => <div className="p-8">Pricing Page</div>;
const LoginPage = () => <div className="p-8">Login Page</div>;

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:templateId" element={<TemplatePage />} />
            <Route path="/create" element={<CreateResumePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:category" element={<BlogPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
