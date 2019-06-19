import React from 'react';

interface IErrorBoundary {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<{}, IErrorBoundary> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: any) {
    console.log(error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: any, info: any) {
    console.log(error);
    console.log(info);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
