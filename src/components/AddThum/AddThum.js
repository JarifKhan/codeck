import ThumDisplay from "../ThumDisplay/ThumDisplay";
import ThumAddBtn from '../ThumAddBtn/ThumAddBtn';

function AddThum(props) {

    const addUserHandler = (event) =>{
        event.preventDefault();
        props.onAddThum();
        
    };


    return(
        <form onSubmit={addUserHandler}>
            <ThumDisplay></ThumDisplay>
            <ThumAddBtn type = "submit"></ThumAddBtn>
            
        </form>
    );
};

export default AddThum;