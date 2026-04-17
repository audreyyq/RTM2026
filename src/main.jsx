import React from 'react'
import ReactDOM from 'react-dom/client'
import '@zendeskgarden/css-bedrock/dist/index.css'
import App from './App'
import './styles/index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log('App starting...');

try {
  const root = document.getElementById('root');
  console.log('Root element:', root);
  
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
  console.log('Render called successfully');
} catch (e) {
  console.error('Render error:', e);
  document.body.innerHTML = '<div style="padding:20px;color:red;">Error: ' + e.message + '</div>';
}
