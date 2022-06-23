import React from "react";
import './SearchBar.css';


export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {term: ''};
        this.search = this.search.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    search() {
        if (this.state.term === '') {
            this.props.onSearch(window.sessionStorage.getItem('searchTerm'))
        } else {
          this.props.onSearch(this.state.term)  
        }
        
    }
    handleOnChange(e) {
        
        window.sessionStorage.setItem('searchTerm',e.target.value)
        this.setState({term: e.target.value});

    }
    render() {
       
        return (
            <div className="SearchBar">
                <input defaultValue={window.sessionStorage.getItem('searchTerm')} onChange={this.handleOnChange} placeholder="Song, Album, or Artist" />
                <button onClick={this.search} className="SearchButton">SEARCH</button>
            </div>
        )
    }
}
