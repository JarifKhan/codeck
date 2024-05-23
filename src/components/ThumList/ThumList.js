import ThumDisplay from "../ThumDisplay/ThumDisplay";

function Thumlist(props) {

    return (

        <div>
            {props.pages.map((page) => (<ThumDisplay key= {page.id}></ThumDisplay>))}
        </div>
    );
};

export default Thumlist;