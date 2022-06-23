import React from 'react';
import './Player.css';


// Resources

const playButton = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
 )
};
const pauseButton = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}

const muteButton = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
    )
}

const unmuteButton = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
    )
}

const defaultImg = 'https://st.depositphotos.com/1815767/1413/v/950/depositphotos_14136466-stock-illustration-cassette-tape-sketch.jpg'


export class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            volume: true,
            value: 0
        }
        this.audioRef = React.createRef();
        this.timelineRef = React.createRef();
        this.toggleAudio = this.toggleAudio.bind(this);
        this.renderPlayerButton = this.renderPlayerButton.bind(this);
        this.timelineProgress = this.timelineProgress.bind(this);
        this.reset = this.reset.bind(this);
        this.renderSoundButton = this.renderSoundButton.bind(this);
        this.toggleVolume = this.toggleVolume.bind(this);
        this.changeSeek = this.changeSeek.bind(this);
        this.goToTrack = this.goToTrack.bind(this);
    }

    // Renders the Mute/Unmute button
    renderSoundButton() {
        if (this.state.volume) {
            return muteButton();
        } else {
            return unmuteButton();
        }
    }
    // Renders Play/Pause button

    renderPlayerButton() {
        if (this.state.isPlaying) {
           return pauseButton()
        } else {
            return playButton()
        }
    }
    // Resets the states and styles when a song has ended

    reset() {
        
        this.setState({
             isPlaying: false,
             value: 0})
        
        this.timelineRef.current.style.backgroundSize = `0% 100%`;
        
    }

    // Shows the song time progression

    timelineProgress() {
        const audio = this.audioRef;
        const currentPos = Math.floor((audio.current.currentTime / audio.current.duration) * 100);
        this.timelineRef.current.style.backgroundSize = `${currentPos}% 100%`;
        this.setState({value: currentPos})
        
        
    }

    

    // Plays/Pauses the song

    toggleAudio() {
        if (!this.props.track.preview) return;

        const audio = this.audioRef
        if (!audio.current.paused) {
            audio.current.pause();
            this.setState({isPlaying: false});
               
        } else {
            audio.current.play();
            this.setState({isPlaying: true});
            
            
        }
            
    }
    // Mutes/Unmutes the song

    toggleVolume() {
        if (!this.props.track.preview) return;
        const audio = this.audioRef;
       
        if (this.state.volume) {
            audio.current.muted = true
            this.setState({volume: false})
        } else {
            audio.current.muted = false
            this.setState({volume: true});
        }
    }

    //Allows to manipulate the timeline

    changeSeek(e) {
        if (!this.props.track.preview) return;
        const audio = this.audioRef
     
        const target = Math.floor((audio.current.duration / 100) * e.target.value);
        audio.current.currentTime = target;
        

    }

    // Goes to Spotify page of the track

    goToTrack() {
        if (!this.props.track.external_url) return;

        this.props.goToTrack(this.props.track.external_url)
    }

   
 

    render() {
        
        return (
           
            <div className='Player'>
                <div className='heading'>
                    <h2> Preview player </h2>
                </div>
                 
                 <div className='icon-container'>
                    
                    <img onClick={this.goToTrack} src={this.props.track.imgMedSize ? this.props.track.imgMedSize : defaultImg} alt="album-logo, click to visit song page on Spotify"  />
    
                </div>
                <div className='audio'>
                    <audio onEnded={this.reset} onLoadStart={this.toggleAudio} onTimeUpdate={this.timelineProgress} ref={this.audioRef} src={this.props.track.preview} >

                    </audio>
                </div>
                <div className='controls-container'>
                    <div className='song-information'>
                        <h3 className='glow'> {this.props.track.name} </h3>
                        <p> {this.props.track.artist} </p>
                    </div>
                    <div  className='controls'>
                        <button onClick={this.toggleAudio} className='controls-button'>
                            {this.renderPlayerButton()}
                        </button>
                        <input onChange={this.changeSeek} ref={this.timelineRef} className='timeline' type="range" min="0" max="100" value={this.state.value}>

                        </input>
                        <button onClick={this.toggleVolume} className='controls-button'>
                            {this.renderSoundButton()}
                        </button>
                    </div>
                </div>
                
                

            </div>
        )
    }
}