import React from "react";
import './UserPlaylist.css'



export class UserPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.openPlaylist = this.openPlaylist.bind(this);
        
    }

    openPlaylist() {
        this.props.openPlaylist(this.props.playlistInfo);
        this.props.setAllowAddTracks(true)
        
    }

   

    render() {
        return (
            <h3 onClick={this.openPlaylist} className="playlist-header">{this.props.playlistInfo.name}</h3>
        )
    }
}