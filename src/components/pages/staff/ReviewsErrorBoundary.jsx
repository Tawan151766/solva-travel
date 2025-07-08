"use client";

import React from "react";

export class ReviewsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Reviews Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#1e1c15] rounded-xl p-6 sm:p-8 text-center">
          <div className="mb-4">
            <svg 
              className="w-12 h-12 mx-auto text-red-400 mb-4"
              fill="currentColor" 
              viewBox="0 0 256 256"
            >
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
            </svg>
            <h3 className="text-white text-xl font-bold mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-[#bcb69f] text-base mb-4">
              We couldn't load the reviews right now. Please try refreshing the page.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#d4af37] hover:bg-[#c49e2a] text-[#231f10] px-6 py-2 rounded-full font-medium transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-[#3f3b2c] hover:bg-[#4a4221] text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left">
              <summary className="text-[#bcb69f] cursor-pointer">
                Debug Information
              </summary>
              <pre className="mt-2 text-xs text-red-400 bg-[#2a2821] p-3 rounded overflow-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for easier use
export function ReviewsErrorWrapper({ children }) {
  return (
    <ReviewsErrorBoundary>
      {children}
    </ReviewsErrorBoundary>
  );
}
