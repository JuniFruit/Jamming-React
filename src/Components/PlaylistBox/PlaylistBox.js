import React, { createRef } from "react";
import { Playlist } from "../Playlist/Playlist";
import './PlaylistBox.css';
import { UserPlaylist } from "../UserPlaylist/UserPlaylist";
import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";


export class PlaylistBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistId: null
        }
        this.containerRef = React.createRef();
        this.playlistRef = React.createRef();
        this.openPlaylist = this.openPlaylist.bind(this);
        this.closePlaylist = this.closePlaylist.bind(this);
    }

    closePlaylist() {
        this.props.resetPlaylistTracks();
        this.containerRef.current.style.transform = `translate(${0}%)`;
        this.playlistRef.current.style.transform = `translate(${-100}%)`
        
    }

    openPlaylist(playlistInfo) {
        this.props.getPlaylistTracks(playlistInfo);
        this.props.setAllowAddTracks(true);
        this.setState({playlistId: playlistInfo.id})
        this.containerRef.current.style.transform = `translate(${100}%)`;
        this.playlistRef.current.style.transform = `translate(${0}%)`;
  
    }
    

    render() {
        return (
            <div className="PlaylistBox">
                <div className="playlist-wrapper">
                    <div className="container" ref={this.containerRef}>
                        <h2> User Playlists</h2>
                        { this.props.playlists.map(item => {
                        return <UserPlaylist setAllowAddTracks={this.props.setAllowAddTracks} openPlaylist={this.openPlaylist} playlistInfo={item} key={item.id} />
                        })}
                        <div className="create-playlist">
                            <button onClick={this.openPlaylist} className="create-button" > CREATE PLAYLIST </button>
                        </div>
                        
                    </div>
                    
                
                

                </div>
                <div  className="Playlist-container" ref={this.playlistRef}>
                        <Playlist getUserPlaylists={this.props.getUserPlaylists}  playlistId={this.state.playlistId} setAllowAddTracks={this.props.setAllowAddTracks} closePlaylist={this.closePlaylist} previewTrack={this.props.previewTrack} goToTrack={this.props.goToTrack} onSave={this.props.onSave} changePlaylistName={this.props.changePlaylistName} onRemove={this.props.onRemove} playlistTracks={this.props.playlistTracks} playlistName={this.props.playlistName}/>

                </div>
            </div>
            
        )
    }
}