import React from 'react';

export default class DevErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { err: null }; }
  static getDerivedStateFromError(err){ return { err }; }
  componentDidCatch(err, info){ console.error('Caught by boundary:', err, info); }
  render(){
    if (this.state.err) {
      return (
        <pre style={{ whiteSpace: 'pre-wrap', padding: 16, color: '#b00020' }}>
{String(this.state.err && (this.state.err.stack || this.state.err.message))}
        </pre>
      );
    }
    return this.props.children;
  }
}
