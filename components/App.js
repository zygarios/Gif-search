var GIPHY_API_URL = "https://api.giphy.com";
var GIPHY_PUB_KEY = "jJujQNCqWqLOss6CUZ69iRdA4ELYJNIM";

App = React.createClass({
  getInitialState() {
    return {
      loading: false,
      searchingText: "",
      gif: {}
    };
  },
  getGif: function(searchingText, callback) {
    var url =
      GIPHY_API_URL +
      "/v1/gifs/random?api_key=" +
      GIPHY_PUB_KEY +
      "&tag=" +
      searchingText;
    function connect(url) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function() {
          if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText).data;
            resolve(data);
          } else {
            reject(new Error(xhr.statusText));
          }
        };
        xhr.send();
      });
    }
    connect(url)
      .then(data => {
        var gif = {
          url: data.fixed_width_downsampled_url,
          sourceUrl: data.url
        };
        callback(gif);
      })
      .catch(err => console.log(err));
  },
  handleSearch(searchingText) {
    this.setState({ loading: true });
    this.getGif(
      searchingText,
      function(gif) {
        this.setState({
          loading: false,
          gif: gif,
          searchingText: searchingText
        });
      }.bind(this)
    );
  },
  render() {
    var styles = {
      margin: "0 auto",
      textAlign: "center",
      width: "90%"
    };

    return (
      <div style={styles}>
        <h1>Wyszukiwarka GIFow!</h1>
        <p>
          Znajdź gifa na <a href="http://giphy.com">giphy</a>. Naciskaj enter,
          aby pobrać kolejne gify.
        </p>
        <Search onSearch={this.handleSearch} />
        <Gif
          loading={this.state.loading}
          url={this.state.gif.url}
          sourceUrl={this.state.gif.sourceUrl}
        />
      </div>
    );
  }
});
