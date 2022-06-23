import React from "react";
import './SearchResults.css';
import {TrackList} from '../TrackList/TrackList.js';
import { toHaveStyle } from "@testing-library/jest-dom/dist/matchers";


export class SearchResults extends React.Component {
    render() {
        
        return (
            
            <div className="SearchResults">
                <div className="container-header">
                    <h2>Results</h2>
                    <p onClick={this.props.resetSearchResults} className="reset-searchResult"> X </p>
                </div>
                
                
                
                <TrackList previewTrack={this.props.previewTrack} goToTrack={this.props.goToTrack} onAdd={this.props.onAdd} isRemoval={false} tracks={this.props.searchResults} />
            </div>
        )
    }
};