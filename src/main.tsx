import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/home/home.tsx';
import Signin from './pages/signin/signin.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/signin",
    Component: Signin,
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)
