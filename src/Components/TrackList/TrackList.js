import React from "react";
import './TrackList.css';
import {Track} from '../Track/Track';



export class TrackList extends React.Component {

    render() {
        
        return (
            <div className="TrackList">
                
                {this.props.tracks.map(item => {
                    return <Track previewTrack={this.props.previewTrack} goToTrack={this.props.goToTrack} onAdd={this.props.onAdd} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} track={item} key={item.id} />
                })}
            </div>
        )
    }
}