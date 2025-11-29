import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DemoBackend from './pages/DemoBackend'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/demo" element={<DemoBackend />} />
            <Route path="/demo/backend" element={<DemoBackend />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
