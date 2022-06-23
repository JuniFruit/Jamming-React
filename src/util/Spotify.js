


export const Spotify = {
    getAccessToken() {

        const regExp = /(https:\/\/junifruitjammingproject.surge.sh\/)#/;
        const query = window.location.href.replace(regExp, ''); 
        const params = new URLSearchParams(query);
    
        if (params.has('access_token') && params.has('expires_in')) {
            const accessToken = params.get('access_token');
            
            let expiresIn = Number(params.get('expires_in'));
         
            return [accessToken, expiresIn];
        } 
 
    },

    async search(term, accessToken) {
        if (!term) throw new Error('Enter a song name, artist or album');
        
        
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&limit=50&q=${term}`, {
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bearer ${accessToken}`
                                                }
                                    });
        
        const parsedResponse = await response.json();
        
        if (!response.ok || parsedResponse.tracks.items.length === 0) {
            throw new Error(`Couldn't find tracks. Status code: ${response.status}`);
        } else {
            
               return parsedResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                        img: track.album.images[2].url,
                        imgMedSize: track.album.images[1].url,
                        external_url: track.external_urls.spotify,
                        preview: track.preview_url
                    }
                })
        }              
        
   
    },
    async savePlaylist(name, trackURIs, playlistId, accessToken) {
        if (!name) throw new Error('Playlist name cannot be empty');
   
        const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
                };
        

        if (playlistId) {
 
            const updateResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,{
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    uris: trackURIs
                })});
            const updateDetailsResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    name: name,
                    description: 'Updated Jamming Playlist'
                })
            });

            if (!updateResponse.ok || !updateDetailsResponse.ok) {
                throw new Error(`Couldn't update Spotify playlist. Status code: ${updateResponse.status}`);
            
            } else {
                return await updateResponse.json();
            }

        

        } else {
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: headers
                    
            });
            const jsonResponse = await response.json();
            let userID = jsonResponse.id;
                
            const createPlaylistRequest = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: name,
                    description: 'Jamming playlist',
                    public: true
                })

            });
            
            if (!createPlaylistRequest.ok) {
                throw new Error(`Couldn't create playlist. Status code: ${createPlaylistRequest.status}`)
            } 
            const jsonCreatePlaylistRequest = await createPlaylistRequest.json();
            let newPlaylistId = jsonCreatePlaylistRequest.id;
          
            
            return await fetch(`https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                uris: trackURIs
                })
            });

        }
        
       

    },

    async getUserPlaylists(accessToken) {
       
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }

        const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: headers
        });
        
        const parsedPlaylists = await playlistsResponse.json();
        if (!playlistsResponse.ok) {
            throw new Error(`Couldn't get user's playlists. Status code: ${playlistsResponse.status}`)
        }
        return parsedPlaylists.items
  

    },

    async getPlaylistTracks(playlistId, accessToken) {

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
        const userTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: headers
        })

        const parsedTracks = await userTracksResponse.json();
        

        if (!userTracksResponse.ok) {
            throw new Error(`Couldn't fetch data. Status code: ${userTracksResponse.status}`)
        }
        
        return parsedTracks.items.map(item => {
                return {
                    id: item.track.id,
                    name: item.track.name,
                    artist: item.track.artists[0].name,
                    album: item.track.album.name,
                    uri: item.track.uri,
                    img: item.track.album.images[2].url,
                    imgMedSize: item.track.album.images[1].url,
                    external_url: item.track.external_urls.spotify,
                    preview: item.track.preview_url
                }
            })

       
    }


    
}

