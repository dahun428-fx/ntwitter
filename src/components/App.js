import React,{useState, useEffect} from 'react';
import Router from 'components/Router';
import { authService } from 'fbInstance';
import 'antd/dist/antd.css';

function App() {
  
  const [ Init, setInit ] = useState(false);
  const [ IsLoggedIn, setIsLoggedIn ] = useState(false);
  useEffect(()=>{
    authService.getAuth().onAuthStateChanged((user)=>{
      if(user){
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  },[]);
  return (
    <>
    {Init &&
      <Router isLoggedIn={IsLoggedIn}/>
    }
    </>
  );
}

export default App;
