import React, { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="empty-state animate-fade-in">
          <div className="empty-state-icon">💥</div>
          <h3 className="empty-state-title">Something went wrong</h3>
          <p className="empty-state-desc">{this.state.error?.message ?? 'An unexpected error occurred.'}</p>
          <button
            className="btn btn-secondary"
            style={{ marginTop: 16 }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Inline error display for data-fetch errors inside cards / sections.
 */
export const ErrorBox: React.FC<{ message: string }> = ({ message }) => (
  <div className="error-box animate-fade-in">
    <span>⚠️</span>
    <span>{message}</span>
  </div>
);
