import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '', name: '', avatar: '', followcount: '', errmssg: '', followersurl: '', followername: '', followersinfo: '', currentpage: '', maxpages: '', remainderpages: '' };

    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.getGitUser = this.getGitUser.bind(this);
    this.listGitfollowers = this.listGitfollowers.bind(this);
    this.listmoreGitfollowers = this.listmoreGitfollowers.bind(this);
  }

  handleChange(event) {
      this.setState({value: event.target.value});
  }

  getGitUser(event) {
  	var uri = this.state.value;
  	//console.log(uri); // things we do in development to make sure we aren't going crazy


  	// this uses the URI and concatenates the username/input value with the github api address we want to use
  	var url = String("https://api.github.com/users/"+ uri);

  	//stops the default on submit event that browsers do on text input submission
  	event.preventDefault();

  	//run a fetch request to github and parse the message output. also saves the message in the case of an error etc
    fetch(url)
    	.then(response => response.json())
    	.then(myJson => {
        this.setState({ errmssg: String(myJson.message) });
        this.setState({ name: String(myJson.login) });
        this.setState({ avatar: String(myJson.avatar_url) });
        this.setState({ followcount: String(myJson.followers) });
        this.setState({ followersurl: String(myJson.followers_url) });
      });  
  }


  listGitfollowers() {
  	var followersurl = this.state.followersurl + "?per_page=100";
  	//var followercount = this.state.followcount;
  	var maxpages = Math.floor(this.state.followcount / 100);
  	var remainderpages = this.state.followcount % 100;
  	var currentpage = 1;
  	this.setState({ currentpage: currentpage});
  	this.setState({ maxpages: maxpages});
  	this.setState({ remainderpages: remainderpages});

  	fetch(followersurl)
  		.then(response => response.json())
  		.then(myJson => {
  			var fJsonprep = JSON.stringify(myJson);
  			var fJson = JSON.parse(fJsonprep);
  			var followersinfo = fJson.map((fJson) =>
  				<li key={fJson.id}><h3 key={fJson.login}>{fJson.login}</h3><img key={fJson.avatar_url} src={fJson.avatar_url} alt="follower avatar"></img></li>
  			);

  			this.setState({ followersinfo: followersinfo });
  			
  	  });
  }

	listmoreGitfollowers() {
		var n = this.state.currentpage + 1;
		console.log(n);
		this.setState({ currentpage: n});

  	var followersurl = this.state.followersurl + "?per_page=100&page=" + String(n);

  	fetch(followersurl)
  		.then(response => response.json())
  		.then(myJson => {
  			var fJsonprep = JSON.stringify(myJson);
  			var fJson = JSON.parse(fJsonprep);
  			var followersinfo = fJson.map((fJson) =>
  				<li key={fJson.id}><h3 key={fJson.login}>{fJson.login}</h3><img key={fJson.avatar_url} src={fJson.avatar_url} alt="follower avatar"></img></li>
  			);

  			this.setState({ followersinfo: followersinfo });
  	  });
  }

  render() {
  	var message = this.state.errmssg;
  	var username = this.state.name;
  	var followers = this.state.followcount;
  	var avatar = this.state.avatar;
  	var followersinfo = this.state.followersinfo;

  	if (message !== "Not Found" && username !== '' && followersinfo.length === 0) {
  		return(
  			<div>
	  			<form onSubmit={this.getGitUser}>
	  			  <label>
	  			    <input type="text" value={this.state.value} placeholder="Enter a Github Username Here" onChange={this.handleChange}/>
	  			  </label>
	  			  <input type="submit" value="Submit" />
	  			</form>
	  			<div>
	  	    	<h1> {username} || {followers} followers </h1>
	  	    	<img src={ avatar } alt="user avatar" id="primaryavatar"></img>
	  	    	<br/>
	  	    	<button onClick={this.listGitfollowers}>List {username}'s Github Followers</button>
	  	    </div>
  	    </div>
  	   );
  	} else if (message !== "Not Found" && username !== '' && followers > 100) {
  		return(
  			<div>
	  			<form onSubmit={this.getGitUser}>
	  			  <label>
	  			    <input type="text" value={this.state.value} placeholder="Enter a Github Username Here" onChange={this.handleChange}/>
	  			  </label>
	  			  <input type="submit" value="Submit" />
	  			</form>
	  			<div>
	  	    	<h1> {username} || {followers} followers </h1>
	  	    	<img src={ avatar } alt="user avatar" id="primaryavatar"></img>
	  	    	<br/>
	  	    	<button onClick={this.listGitfollowers}>List {username}'s Github Followers</button>
	  	    </div>
	  	    <div>
	  	    	<div><button onClick={this.listmoreGitfollowers}>Next 100 of {username}'s Github Followers</button><br/><ul>{followersinfo}</ul></div>
	  	    </div>
  	    </div>
  	   );
  	} else if (message !== "Not Found" && username !== '') {
  		return(
  			<div>
	  			<form onSubmit={this.getGitUser}>
	  			  <label>
	  			    <input type="text" value={this.state.value} placeholder="Enter a Github Username Here" onChange={this.handleChange}/>
	  			  </label>
	  			  <input type="submit" value="Submit" />
	  			</form>
	  			<div>
	  	    	<h1> {username} || {followers} followers </h1>
	  	    	<img src={ avatar } alt="user avatar" id="primaryavatar"></img>
	  	    	<br/>
	  	    	<button onClick={this.listGitfollowers}>List {username}'s Github Followers</button>
	  	    </div>
	  	    <div>
	  	    	<div><ul>{followersinfo}</ul></div>
	  	    </div>
  	    </div>
  	   );
  	} else {
  		return(
  			<form onSubmit={this.getGitUser}>
  			  <label>
  			    <input type="text" value={this.state.value} placeholder="Enter a Github Username Here" onChange={this.handleChange}/>
  			  </label>
  			  <input type="submit" value="Submit" />
  			</form>
  		);
  	}
  }
}

export default App;