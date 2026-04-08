import { LanguageProvider } from './contexts/LanguageContext';
import { WatermarkEditor } from './pages/WatermarkEditor';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { ToastContainer } from './components/Toast';

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <WatermarkEditor />
      <TickerBar />
      <ToastContainer />
    </LanguageProvider>
  );
}

export default App;
