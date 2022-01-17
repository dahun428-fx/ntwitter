import React,{useState, useEffect} from 'react';
import Router from 'Components/Router';
import { authService } from 'fbInstance';

function App() {
  
  const [ Init, setInit ] = useState(false);
  const [ IsLoggedIn, setIsLoggedIn ] = useState(false);
  const [ User, setUser ] = useState(null);
  useEffect(()=>{
    authService.getAuth().onAuthStateChanged((user)=>{
      if(user){
        setIsLoggedIn(true);
        // setUser({
        //   displayName : user.displayName,
        //   uid : user.uid,
        //   updateProfile : (args) => user.updateProfile(args),
        // });
        setUser(user);
      } else {
        setIsLoggedIn(false);
      }
      // console.log('setuser', User)
      setInit(true);
    })
  },[]);
  const refreshUser = () => {
    const user = authService.getAuth().currentUser;
    // console.log(user);
    // setUser({
    //   displayName : user.displayName,
    //   uid : user.uid,
    //   updateProfile : (args) => user.updateProfile(args),
    // })
    // console.log('refresh')
    setUser(Object.assign({}, user));
  }
  return (
    <>
    {Init && 
      <Router refreshUser={refreshUser} isLoggedIn={IsLoggedIn} User={User}/>
    }
    </>
  );
}

export default App;
