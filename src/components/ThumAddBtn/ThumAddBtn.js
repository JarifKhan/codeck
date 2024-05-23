import "./ThumAddBtn.css";


function ThumAddBtn(props) {

    return (
        <div className="areatdb">
            <button className="innerareatdb" type={props.type || "button"} onClick={props.onClick}>
                {props.children}
                <hr className="hline"></hr>
                <hr className="vline"></hr>
            </button>
        </div>
    )
}

export default ThumAddBtn;