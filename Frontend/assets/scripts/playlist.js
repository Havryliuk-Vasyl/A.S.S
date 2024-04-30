class Playlist{
    constructor(){}

    includeStyles(){
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "../assets/styles/playlist.css";
        document.head.appendChild(link);
    }

    getUserPlaylists(){

    }

    renderUserPlaylist(){
        this.includeStyles();
        document.getElementById("playlistsInMain")
        try{
            
        }
        catch(error){

        }
    }
}

export default Playlist;