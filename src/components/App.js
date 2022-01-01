import React,{useState, useEffect} from 'react';
import Router from 'Components/Router';
import { authService } from 'fbInstance';
import 'antd/dist/antd.css';

function App() {
  
  const [ Init, setInit ] = useState(false);
  const [ IsLoggedIn, setIsLoggedIn ] = useState(false);
  const [ User, setUser ] = useState(null);
  useEffect(()=>{
    authService.getAuth().onAuthStateChanged((user)=>{
      if(user){
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  },[]);
  return (
    <>
    {Init && User &&
      <Router isLoggedIn={IsLoggedIn} User={User}/>
    }
    </>
  );
}

export default App;
