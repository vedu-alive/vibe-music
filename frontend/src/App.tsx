// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import './App.css'
// import { Button } from './components/ui/button'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import AuthCallback from './pages/auth-callback/AuthCallback';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import MainLayout from './components/Layout/MainLayout';
import Chat from './pages/chat/Chat';
import Albums from './pages/albums/Album';
import Admin from './pages/admin/Admin';
import { Toaster } from 'react-hot-toast';
import Error404 from './pages/Error404/Error404';

function App() {
  //* token
  return (
    <>
      <Routes>
        <Route path='/sso-callback' element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={'/auth-callback'} />}/>
        <Route path='/auth-callback' element={<AuthCallback />} />
        <Route path='/admin' element={<Admin/>} />
        <Route path='/' element={<MainLayout/>}>
          <Route path='/' element={<Home />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/albums/:albumId' element={<Albums />} />
          <Route path='*' element={<Error404 />} />
        </Route>
      </Routes>
      <Toaster/>
    </>
  );
}

export default App
