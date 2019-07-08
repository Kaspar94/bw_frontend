import React from "react";
import axios from "axios";
import "./App.css";
import Spinner from "./Spinner";
import Alert from "./Alert";

const url = "ws://0.0.0.0:7000";

class App extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      dogVotes: 0,
      catVotes: 0,
      loading: false,
      text: "",
      alert: false,
      alertType: ""
    };
  }

  connect(text) {
    let ws = new WebSocket(url);

    ws.onopen = () => {};

    ws.onmessage = evt => {
      const resp = JSON.parse(evt.data);
      const dogVotes = resp.find(elem => elem.name === "Koer");
      const catVotes = resp.find(elem => elem.name === "Kass");

      this.setState({
        dogVotes: dogVotes ? dogVotes.count : 0,
        catVotes: catVotes ? catVotes.count : 0
      });

      this.setState({ loading: false });
    };

    ws.onclose = () => {
      // try to reconnect
      setTimeout(
        () => this.connect("Connection lost. Trying to reconnect.."),
        1000
      );
    };

    this.setState({ loading: true, text, ws });
  }

  componentDidMount() {
    this.connect("Connecting to server..");
  }

  showAlert(alert = "", type = "") {
    this.setState({ alert, type });
    console.log(this.state);
    setTimeout(() => this.setState({ alert: false }), 2100);
  }

  handleSubmit(e) {
    this.setState({ loading: true, text: "Sending vote..." });
    const payload = {
      votedItem: e
    };
    axios
      .post("http://0.0.0.0:8080/voting", payload)
      .then(res => {
        this.state.ws.send("vote");
        this.showAlert("Success", "success");
      })
      .catch(e => {
        this.showAlert("Voting failed. Sorry");
      })
      .finally(() => this.setState({ loading: false }));
  }

  render() {
    return (
      <div className="mainContainer">
        <Spinner loading={this.state.loading} text={this.state.text} />
        <div className="content">
          <div className="content__container">
            <h2>Cats or dogs?</h2>

            <div className="buttons">
              <button
                type="button"
                className="button-vote cat"
                onClick={() => this.handleSubmit("Kass")}
              >
                Cats
              </button>
              <button
                type="button"
                className="button-vote dog"
                onClick={() => this.handleSubmit("Koer")}
              >
                Dogs
              </button>
            </div>
            {this.state.alert ? (
              <div className="alert-wrapper">
                <Alert text={this.state.alert} type={this.state.type} />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="content__container">
            <h2>Results:</h2>
            <div className="buttons">
              <div className="field-wrapper cat">
                <div>Cats:</div>
                <div className="">
                  <b>{this.state.catVotes}</b>
                </div>
              </div>
              <div className="field-wrapper dog">
                <div className="">Dogs:</div>
                <div className="">
                  <b>{this.state.dogVotes}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div />
      </div>
    );
  }
}

export default App;
