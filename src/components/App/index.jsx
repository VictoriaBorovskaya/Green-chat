import './App.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from 'components/Login';
import NotFoundPage from 'components/NotFoundPage';
import ChatsPage from 'components/ChatsPage';

function App() {
  const [user, setUser] = useState({
    idInstance: null,
    apiTokenInstance: null,
  });

  return (
    <div className="h-screen bg-[#eae6df] relative flex items-center justify-center m-auto">
      <header className="bg-[#00a884] h-28 p-2.5 absolute top-0 left-0 right-0"></header>
      <Routes>
        <Route path="/" element={<Login user={user} setUser={setUser} />}></Route>
        <Route
          path="/chat"
          element={
            user.idInstance !== null ? (
              <ChatsPage setUser={setUser} user={user} />
            ) : (
              <Login user={user} setUser={setUser} />
            )
          }></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
