import '../MainDisplay/MainDisplay.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faMinus, faUpRightAndDownLeftFromCenter, faCopy } from '@fortawesome/free-solid-svg-icons'

function MainDisplay() {
    return (
        <div className="area">
            <div className="innerarea">
                
                <div className='btn'>
                    <button className='redbtn' type='button'>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <button className='yellowbtn' type='button'>
                        <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <button className='greenbtn' type='button'>
                        <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
                    </button>
                </div>
                <div className='lineContainer'>
                    <div className='line'></div>
                </div>

                <div className='textHolder'>
                    <div className='textbox'></div>
                    <div className='cbtncontainer'>
                        <button className='copybtn' type='button'><FontAwesomeIcon icon={faCopy} /></button>
                    <span>copy</span>
                </div>
                </div>
            </div>
        </div>
    )
};

export default MainDisplay;