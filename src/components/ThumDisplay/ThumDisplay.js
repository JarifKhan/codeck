import "./ThumDisplay.css";

function ThumDisplay(props) {
    return (
        <div className="areatd">
            <div className="innerareatd" onClick={props.onClick}>
                {props.children}
            </div>
        </div>
    )
}

export default ThumDisplay;