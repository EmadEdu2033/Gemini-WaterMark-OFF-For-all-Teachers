import { LanguageProvider } from './contexts/LanguageContext';
import { WatermarkEditor } from './pages/WatermarkEditor';
import { Navbar } from './components/Navbar';
import { TickerBar } from './components/TickerBar';
import { ToastContainer } from './components/Toast';
import { WelcomeVideoModal } from './components/WelcomeVideoModal';

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <WatermarkEditor />
      <TickerBar />
      <ToastContainer />
      <WelcomeVideoModal />
    </LanguageProvider>
  );
}

export default App;
