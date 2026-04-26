import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children:  ReactNode
  pageName?: string
}

interface State {
  hasError: boolean
  message:  string
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error) {
    console.error(`[ErrorBoundary] ${this.props.pageName ?? "Page"} crashed:`, error)
  }

  reset = () => {
    this.setState({ hasError: false, message: "" })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertTriangle
          size={32}
          className="text-amber-400 dark:text-amber-500 mb-4"
        />
        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
          Something went wrong
          {this.props.pageName ? ` on the ${this.props.pageName} page` : ""}
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-sm">
          {this.state.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={this.reset}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            bg-teal-600 hover:bg-teal-700 text-white transition-colors
          "
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    )
  }
}