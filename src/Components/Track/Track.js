import React from "react";
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.trackRef = React.createRef();
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.goToTrack = this.goToTrack.bind(this);
        this.previewTrack = this.previewTrack.bind(this);
    }
    renderAction() {
        if (this.props.isRemoval) {
           return <button className="Track-action" onClick={this.removeTrack}> - </button>
        } else {
           return <button className="Track-action" onClick={this.addTrack}> + </button>
        }
    }
    addTrack() {
        
        this.props.onAdd(this.props.track);
        // this.trackRef.current.style.width = 0 + 'px'
        
    }
    removeTrack() {
        
        this.props.onRemove(this.props.track);
   
    }
    goToTrack() {
        this.props.goToTrack(this.props.track.external_url)
    }

    previewTrack() {
        this.props.previewTrack(this.props.track);
    }
   
    render() {
       
        return (
            <div ref={this.trackRef} className="Track">
                <div className="Track-img">
                    <img onClick={this.goToTrack} src={this.props.track.img} alt="album_img 64"/>
                </div>
                <div className="Track-information">
                    <div className="Track-header">
                        <h3 onClick={this.previewTrack}>{this.props.track.name}</h3>
                    </div>
                    
                    <p> {this.props.track.artist} | {this.props.track.album}</p>
                    <p> Tap to listen </p>
                </div>
                <div>
                    {this.renderAction()}
                </div>
                
            </div>
        )
    }
}