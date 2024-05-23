import MainDisplay from "./components/MainDisplay/MainDisplay";
import Thumlist from "./components/ThumList/ThumList";
import AddThum from './components/AddThum/AddThum';
import { useState } from "react";
function App() {

  const [pagesList,setPagesList] = useState([]);

  const addUserHandler = () => {
    setPagesList((prevUsersList) =>{
      return [...prevUsersList,{id:Math.random().toString()}];
    });
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="tumcontainer">
          <AddThum onAddThum={addUserHandler}></AddThum>
          <Thumlist pages ={pagesList}/>
        </div>
        <div>
          <MainDisplay></MainDisplay>
        </div>
      </div>
      <div className="BackgroundImages">
      </div>
    </div>
  );
};

export default App;
