import { BrowserRouter, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import { useTheme } from "./hooks/useTheme"
import Home    from "./pages/Home"
import Todo    from "./pages/Todo"
import Weather from "./pages/Weather"
import News    from "./pages/News"
import Stocks  from "./pages/Stocks"
import Meals   from "./pages/Meals"
import Goals   from "./pages/Goals"

export default function App() {
  const { isDark, toggle } = useTheme()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-navy-700 transition-colors duration-200">
        <Sidebar isDark={isDark} toggle={toggle} />
        <main className="ml-56 min-h-screen p-8">
          <Routes>
            <Route path="/"        element={<Home />}    />
            <Route path="/todo"    element={<Todo />}    />
            <Route path="/weather" element={<Weather />} />
            <Route path="/news"    element={<News />}    />
            <Route path="/stocks"  element={<Stocks />}  />
            <Route path="/meals"   element={<Meals />}   />
            <Route path="/goals"   element={<Goals />}   />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}