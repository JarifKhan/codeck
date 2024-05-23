import BackgroundItemsCSS from "../BackgroundItems/BackgroundItems.module.css"
import { ReactComponent as BlackCircle } from './BackgroundImages/black_circle.svg';

function BackgroundItems() {
    return (
        <div className={BackgroundItemsCSS.container}>
            <div >
                <BlackCircle></BlackCircle>
            </div>
        </div>
    )
};

export default BackgroundItems;