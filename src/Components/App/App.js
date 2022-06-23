import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';
import React from 'react';
import { Spotify } from '../../util/Spotify';
import { Player } from '../Player/Player';
import { PlaylistBox } from '../PlaylistBox/PlaylistBox';
import { PopUpWindow } from '../PopUpWindow/PopUpWindow';
import { SearchBar } from '../SearchBar/SearchBar.js';
import { SearchResults } from '../SearchResults/SearchResults.js';
import './App.css';

const clientID = '5304115adf274669b2598da4bc472f38';
const redirectURI = 'https://junifruitjammingproject.surge.sh/';
let accessToken = window.sessionStorage.getItem('accessToken');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      trackInfo: '',
      playlists: [],
      allowAddTracks: false,
      playlistId: null,
      
      popupActive: false,

    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.changePlaylistName = this.changePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.goToTrack = this.goToTrack.bind(this);
    this.previewTrack = this.previewTrack.bind(this);
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.getPlaylistTracks = this.getPlaylistTracks.bind(this);
    this.setAllowAddTracks = this.setAllowAddTracks.bind(this);
    this.resetPlaylistTracks = this.resetPlaylistTracks.bind(this);
    this.setPopupWindow = this.setPopupWindow.bind(this);
    this.handlePopup = this.handlePopup.bind(this);
    this.resetSearchResults = this.resetSearchResults.bind(this);
    this.acquireAccess = this.acquireAccess.bind(this);
  }

  // Sets the track info for preview player

  previewTrack(track) {
    if (track.preview === null) {
      this.setPopupWindow('Error', 'Sorry! There is no preview for this track.');
      return
    } else {
      this.setState({ trackInfo: track });

    }

  }

  // Allows to go to the track page on Spotify

  goToTrack(trackUrl) {
    window.open(trackUrl, 'Spotify')
  }

  // Gets Access token

  acquireAccess() {
    const scope = 'user-read-playback-state user-read-currently-playing user-modify-playback-state playlist-modify-public'
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=${scope}&redirect_uri=${redirectURI}`;
    const response = Spotify.getAccessToken();
    window.sessionStorage.setItem('accessToken', response[0]);

    const expiresIn = response[1];
    window.setTimeout(() => {
        window.sessionStorage.removeItem('accessToken')
    }, expiresIn * 1000);
    window.history.pushState('Access Token', null, '/');
    
  }

  // Brings the results of search from Spotify

  search(value) {
    if (!accessToken) {
      this.acquireAccess();
      return
    }
    this.setPopupWindow('Loading');
    const currentResults = this.state.searchResults;

    Spotify.search(value, accessToken)
      .then(results => {
        this.setState({
          searchResults: results,
          popupActive: false
        });

      })
      .catch(e => { this.setPopupWindow('Error', e.toString()) });
  }

  // Saves the created playlist

  savePlaylist() {
    if (!accessToken) {
      this.acquireAccess();
      return
    }
    this.setPopupWindow('Loading');
    const trackURIs = this.state.playlistTracks.map(item => {
      return item.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs, this.state.playlistId, accessToken)
      .then(this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
        playlistId: null,
        popupActive: false
      }))
      .catch(e => this.setPopupWindow('Error', e.toString()))





  }

  // Handles the change of a playlist name

  changePlaylistName(value) {
    this.setState({ playlistName: value });
  }

  // Adds a track from search results to the opened UI playlist

  addTrack(track) {
    if (!this.state.allowAddTracks) return;


    const isInPlaylist = this.state.playlistTracks.some(item => {
      return item.id === track.id
    });
    if (!isInPlaylist) {
      const playList = this.state.playlistTracks;
      playList.unshift(track);
      const filteredResults = this.state.searchResults.filter(item => {
        return item.id !== track.id
      });
      window.sessionStorage.setItem('prevPlaylistTracks', JSON.stringify(playList))
      this.setState({
        playlistTracks: playList,
        searchResults: filteredResults
      });
    }
  }

  // Removes a track from currently opened UI playlist

  removeTrack(track) {


    let updatedPlaylist = this.state.playlistTracks.filter(item => {

      return item.id !== track.id;
    });

    const isInSearchResults = this.state.searchResults.some(item => {
      return item.id === track.id
    });
    if (!isInSearchResults) {
      const updatedResult = this.state.searchResults
      updatedResult.unshift(track)
      this.setState({
        playlistTracks: updatedPlaylist,
        searchResults: updatedResult
      });
      window.sessionStorage.setItem('prevPlaylistTracks', JSON.stringify(updatedPlaylist))
    } else {
      window.sessionStorage.setItem('prevPlaylistTracks', JSON.stringify(updatedPlaylist))
      this.setState({
        playlistTracks: updatedPlaylist
      })
    }


  }

  // Shows current user's playlist once they logged in

  getUserPlaylists() {
    if (!accessToken) {
      this.acquireAccess();
      return
    }
    this.setPopupWindow('Loading');
    Spotify.getUserPlaylists(accessToken)
      .then(response => {
        this.setState({
          playlists: response,
          popupActive: false
        })

      })
      .catch(e => this.setPopupWindow('Error', e.toString()))

  }

  // Gets the tracks for user's opened playlist

  getPlaylistTracks(playlistInfo) {
    if (!accessToken) {
      this.acquireAccess();
      return
    }

    if (!playlistInfo.id) {

      let prevPlaylistData = window.sessionStorage.getItem('prevPlaylistTracks');

      if (prevPlaylistData) {
        this.setState({
          playlistTracks: JSON.parse(prevPlaylistData)

        });
      } else {
        this.setState({
          playlistTracks: []

        });
      }


      return
    };

    Spotify.getPlaylistTracks(playlistInfo.id, accessToken)
      .then(response => {
        this.setState({
          playlistName: playlistInfo.name,
          playlistTracks: response,
          playlistId: playlistInfo.id
        })
      })
      .catch(e => this.setPopupWindow('Error', e.toString()));




  }

  // Allows to add tracks from search results if user opened a playlist or clicked on Create Playlist

  setAllowAddTracks(boolean) {
    this.setState({ allowAddTracks: boolean })
  }

  resetPlaylistTracks() {
    this.setState({
      playlistName: 'New Playlist',
      playlistTracks: [],
      playlistId: null
    })
  }

  handlePopup() {

    this.setState({
      popupActive: false
    })

  }

  setPopupWindow(msgType, msgBody) {
    //if (!msgType) return;

    this.setState({
      popupActive: true,
      msgType: msgType,
      msgBody: msgBody,
    });

  }

  resetSearchResults() {
    this.setState({
      searchResults: []
    })
  }


  componentDidMount() {
    if (accessToken) {
      this.getUserPlaylists();
    }
    

  }


  render() {

    return (

      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <div className='logIn-container'>
            {accessToken ? '' : <button className='logIn-button' onClick={this.getUserPlaylists} >Log in via Spotify</button>}
          </div>

          <SearchBar onSearch={this.search} />
          <div className='player'>
            <Player goToTrack={this.goToTrack} searchResults={this.state.searchResults} track={this.state.trackInfo} />
          </div>

          <div className="App-playlist">

            <SearchResults resetSearchResults={this.resetSearchResults} previewTrack={this.previewTrack} goToTrack={this.goToTrack} onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <PlaylistBox getUserPlaylists={this.getUserPlaylists} resetPlaylistTracks={this.resetPlaylistTracks} setAllowAddTracks={this.setAllowAddTracks} getPlaylistTracks={this.getPlaylistTracks} previewTrack={this.previewTrack} goToTrack={this.goToTrack} onSave={this.savePlaylist} changePlaylistName={this.changePlaylistName} onRemove={this.removeTrack} playlistTracks={this.state.playlistTracks} playlistName={this.state.playlistName} playlists={this.state.playlists} />

          </div>
          <div className='popupWindow'>
            {this.state.popupActive && <PopUpWindow msgType={this.state.msgType} msgBody={this.state.msgBody} handlePopup={this.handlePopup} />}
          </div>
          
        </div>
      </div>


    )
  }


}



export default App;
