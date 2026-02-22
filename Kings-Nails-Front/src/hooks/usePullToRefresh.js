import { useState, useEffect } from 'react';

const usePullToRefresh = (onRefresh) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const threshold = 80; // Distancia mínima para activar refresh

  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e) => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop <= 1) {
        startY = e.touches[0].pageY;
        console.log('🎯 Touch start:', startY, 'scroll:', scrollTop);
      }
    };

    const handleTouchMove = (e) => {
      if (isRefreshing || startY === 0) return;

      currentY = e.touches[0].pageY;
      const distance = currentY - startY;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (distance > 0 && scrollTop <= 1) {
        console.log('📏 Pull distance:', distance);
        setIsPulling(true);
        setPullDistance(Math.min(distance, threshold + 50));
      }
    };

    const handleTouchEnd = async () => {
      if (startY === 0 || isRefreshing) return;

      const distance = currentY - startY;
      console.log('✋ Touch end, distance:', distance, 'threshold:', threshold);

      if (distance > threshold) {
        console.log('🔄 Activando refresh...');
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Error en refresh:', error);
        } finally {
          setTimeout(() => {
            console.log('✅ Refresh completado');
            setIsRefreshing(false);
            setPullDistance(0);
            setIsPulling(false);
            startY = 0;
            currentY = 0;
          }, 500);
        }
      } else {
        setPullDistance(0);
        setIsPulling(false);
        startY = 0;
        currentY = 0;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRefreshing, onRefresh, threshold]);

  return { pullDistance, isRefreshing, isPulling };
};

export default usePullToRefresh;
