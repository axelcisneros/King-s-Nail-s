import Router from './routes/Router';
import PullToRefresh from './components/PullToRefresh/PullToRefresh';

export default function App() {
  const handleRefresh = async () => {
    console.log('🔄 Refresh iniciado');
    // Dar tiempo para la animación
    await new Promise(resolve => setTimeout(resolve, 300));
    // Recargar completamente
    window.location.reload();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Router />
    </PullToRefresh>
  );
}
