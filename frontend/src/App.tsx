import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { useTheme } from "./hooks/useTheme"
import Home    from "./pages/Home"
import Todo    from "./pages/Todo"
import Weather from "./pages/Weather"
import News    from "./pages/News"
import Stocks  from "./pages/Stocks"
import Meals   from "./pages/Meals"
import Goals   from "./pages/Goals"

function PageWrapper({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <ErrorBoundary pageName={name}>
      {children}
    </ErrorBoundary>
  )
}

export default function App() {
  const { isDark, toggle } = useTheme()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-navy-700 transition-colors duration-200">
        <Sidebar isDark={isDark} toggle={toggle} />
        <main className="ml-56 min-h-screen p-8">
          <Routes>
            <Route path="/"        element={<PageWrapper name="Home">    <Home />    </PageWrapper>} />
            <Route path="/todo"    element={<PageWrapper name="Tasks">   <Todo />    </PageWrapper>} />
            <Route path="/weather" element={<PageWrapper name="Weather"> <Weather /> </PageWrapper>} />
            <Route path="/news"    element={<PageWrapper name="News">    <News />    </PageWrapper>} />
            <Route path="/stocks"  element={<PageWrapper name="Stocks">  <Stocks />  </PageWrapper>} />
            <Route path="/meals"   element={<PageWrapper name="Meals">   <Meals />   </PageWrapper>} />
            <Route path="/goals"   element={<PageWrapper name="Goals">   <Goals />   </PageWrapper>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}