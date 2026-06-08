import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/40">
          <p className="font-semibold text-red-800 dark:text-red-200">
            {this.props.label ?? "画面"}の表示でエラーが発生しました
          </p>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{this.state.error.message}</p>
          <button
            type="button"
            className="mt-4 rounded bg-red-600 px-4 py-2 text-sm text-white"
            onClick={() => this.setState({ error: null })}
          >
            再試行
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
