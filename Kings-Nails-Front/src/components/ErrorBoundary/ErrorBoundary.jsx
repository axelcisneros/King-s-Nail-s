import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log para debugging
  console.error('ErrorBoundary caught error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
          <strong>Error al renderizar el gráfico</strong>
          <div style={{ marginTop: 8 }}>{this.props.fallback || this.state.error?.message || 'Intenta recargar la página.'}</div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// PropTypes
import PropTypes from 'prop-types';
ErrorBoundary.propTypes = {
  fallback: PropTypes.node,
  children: PropTypes.node.isRequired,
};
