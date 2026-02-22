import PropTypes from 'prop-types';
import usePullToRefresh from '../../hooks/usePullToRefresh';
import styles from './PullToRefresh.module.css';

const PullToRefresh = ({ onRefresh, children }) => {
  const { pullDistance, isRefreshing, isPulling } = usePullToRefresh(onRefresh);

  const showIndicator = (isPulling && pullDistance > 10) || isRefreshing;
  const shouldTrigger = pullDistance > 80;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.indicator}
        style={{
          transform: `translateY(${Math.min(pullDistance, 100)}px)`,
          opacity: showIndicator ? 1 : 0,
          transition: isRefreshing ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        <div className={`${styles.spinner} ${isRefreshing || shouldTrigger ? styles.spin : ''}`}>
          {isRefreshing ? '↻' : shouldTrigger ? '↓' : '↓'}
        </div>
        <span className={styles.text}>
          {isRefreshing ? 'Actualizando...' : shouldTrigger ? 'Suelta para actualizar' : 'Desliza para actualizar'}
        </span>
      </div>
      <div
        className={styles.content}
        style={{
          transform: isRefreshing ? 'translateY(60px)' : `translateY(${Math.min(pullDistance * 0.3, 30)}px)`,
          transition: isRefreshing ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

PullToRefresh.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default PullToRefresh;
