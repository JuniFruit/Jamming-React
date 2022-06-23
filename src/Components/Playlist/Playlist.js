import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";
import React from "react";
import {TrackList} from '../TrackList/TrackList.js';
import './Playlist.css';


export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.closePlaylist = this.closePlaylist.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    onChangeName(e) {
        this.props.changePlaylistName(e.target.value);
        
    }
    onSave() {
        this.props.onSave();
        this.closePlaylist();
        setTimeout(() => {
            this.props.getUserPlaylists();
        }, 500);
        
        window.sessionStorage.removeItem('prevPlaylistTracks'); 
    }

    closePlaylist() {
        this.props.closePlaylist();
        this.props.setAllowAddTracks(false);
        if (this.props.playlistId) {
            window.sessionStorage.removeItem('prevPlaylistTracks')
        }
    }
        
    render() {
        
        return (
            <div className="Playlist">
                <input value={this.props.playlistName} onChange={this.onChangeName} />
                
                <TrackList previewTrack={this.props.previewTrack} goToTrack={this.props.goToTrack} isRemoval={true} onRemove={this.props.onRemove} tracks={this.props.playlistTracks} />
                <div className="buttons-container">
                    <button onClick={this.onSave} className="Playlist-save">SAVE TO SPOTIFY</button>
                    <button onClick={this.closePlaylist} className="goBack">GO BACK</button>
                </div>
                
            </div>
        )
    }

   
}