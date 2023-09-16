import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './components/pages/landingPage';
import DetailContact from './components/pages/detailContact';
import AddContactPage from './components/pages/addContact';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/contact/:id',
    element: <DetailContact />,
  },
  {
    path: '/contact/add',
    element: <AddContactPage />,
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
