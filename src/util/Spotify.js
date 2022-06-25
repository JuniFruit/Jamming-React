
let accessToken = window.sessionStorage.getItem('accessToken');
const clientID = '5304115adf274669b2598da4bc472f38';
const redirectURI = 'https://junifruitjammingproject.surge.sh/';
const scope = 'playlist-modify-public';



export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            
            if (new Date() > new Date(window.sessionStorage.getItem('expireDate'))){
                window.sessionStorage.removeItem('accessToken');
                window.location.reload();
                return;
            } else {
              return accessToken;  
            }
            
        };

        const regExp = /(https:\/\/junifruitjammingproject.surge.sh\/)#/;
        // const regExp = /(http:\/\/localhost:3000\/)#/;

        const query = window.location.href.replace(regExp, '');
        const params = new URLSearchParams(query);


        if (params.has('access_token') && params.has('expires_in')) {
            const userToken = [];
            userToken.push(params.get('access_token'));
            accessToken = window.sessionStorage.setItem('accessToken', userToken[0]);


            let expiresIn = Number(params.get('expires_in'));
            const date = new Date();
            const expireSec = date.getSeconds() + expiresIn;
            date.setSeconds(expireSec);
            console.log(date)
            window.sessionStorage.setItem('expireDate', date);

            window.history.replaceState('', null, '/');
            window.location.reload();
            return;
            
        }
        
        if (!accessToken) {
            
            window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=${scope}&redirect_uri=${redirectURI}`);
        }

    },

    async search(term) {
        if (!term) throw new Error('Enter a song name, artist or album');

        const accessToken = this.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&limit=50&q=${term}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const parsedResponse = await response.json();
        console.log(parsedResponse.tracks);
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
    async savePlaylist(name, trackURIs, playlistId) {
        if (!name) throw new Error('Playlist name cannot be empty');
        const accessToken = this.getAccessToken();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };


        if (playlistId) {

            
            const updateResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({
                    uris: trackURIs
                })
            });
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

    async getUserPlaylists() {
        const accessToken = this.getAccessToken();
        if (!accessToken) return;
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

    async getPlaylistTracks(playlistId) {
        const accessToken = this.getAccessToken();
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

