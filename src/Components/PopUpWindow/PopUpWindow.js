import React from 'react';
import './PopUpWindow.css'

export class PopUpWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingActive: false
        }
        this.renderHeader = this.renderHeader.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.renderLoadingScreen = this.renderLoadingScreen.bind(this);

    }

    renderHeader() {
        if (this.props.msgType === 'Question') {
            return 'Confirm your action'
        }
        if (this.props.msgType === 'Error') {
            return 'Something went wrong'
        }
        
    }

    renderButtons() {
        if (this.props.msgType === 'Question') {
            return (
               <div className='buttons'>
                    <button onClick={this.handleClick}>YES</button>
                    <button onClick={this.handleClick}>NO</button>
               </div> 
            ) 
                
        }
        
        if (this.props.msgType === 'Error') {
            
            return (
                <div className='buttons'>
                    <button onClick={this.handleClick}>OK</button>
                </div>
            )
        }
        
    }

    renderLoadingScreen() {
        if (this.props.msgType === 'Loading') {
             return (
                <div className='loading-container'>
                    <div className='loading-header'>
                        <h3> Loading </h3>
                    </div>
                    <div className='loading-spinner'>
                        <span></span>
                    </div>
                </div>
            )
        } else {
            return
        }
       
            
           
      
        
    }

    handleClick(e) {
        if (e.target.innerHTML === 'YES') {
            this.props.handlePopup(true);
            
        }

        if (e.target.innerHTML === 'NO') {
            this.props.handlePopup(false);
        }
        this.props.handlePopup();
        
    }

    

    render() {
        
        return (
            <div className='popup-window'>
                
                <div className='popup-container'>
                    <div className='popup-header'>
                        <h3> {this.renderHeader()} </h3>
                    </div>
                    <div className='popup-body'>
                        <p> {this.props.msgBody}</p>
                    </div>
                    {this.renderButtons()}
                   
                </div>
                {this.renderLoadingScreen()}
 
            </div>
           
        )
    }
}