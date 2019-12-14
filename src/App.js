import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";

import "bootstrap/dist/css/bootstrap.min.css";

import worker from "./app.worker.js";
import WebWorker from "./WebWorker";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchProgress: null,
      fileNames: [],
      dataVisible: "invisible",
      barVisible: "invisible"
    };
    this.fileInput = React.createRef();

    this.worker = new WebWorker(worker);

    this.worker.addEventListener("message", event => {
      if (event.data.hasOwnProperty("name")) {
        this.setState({
          fileNames: [...this.state.fileNames, event.data.name]
        });
      }
      if (event.data.hasOwnProperty("progress")) {
        this.setState({ searchProgress: event.data.progress });
        console.log(event.data.progress);
      }
      this.forceUpdate();
    });
  }

  handleFiles = event => {
    this.setState({
      fileNames: [],
      dataVisible: "visible",
      barVisible: "visible"
    });

    // console.log("file", this.fileInput.current);
    this.worker.postMessage({
      query: this.state.searchQuery,
      files: this.fileInput.current.files
    });
    event.target.value = null;
  };

  handleClick = event => {
    this.setState({
      searchProgress: 0,
      fileNames: [],
      dataVisible: "invisible",
      barVisible: "invisible"
    });
  };

  render = () => {
    return (
      <Container fluid={true} className="pt-2">
        <Row>
          <Col>
            <Jumbotron className="m-0 mb-2 text-center">
              <h1>Searchy</h1>
              <p>
                Enter a search query below, then select a directory to scan.  
                Avoid directories with too many files.  We'll find any file with matching text or filenames
                and list them below! NOTE: Search is CASE-SENSITIVE!  Enjoy (:
              </p>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="text-center">
              <Card.Header>Choose your directory...</Card.Header>
              <Card.Body>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control
                    type="text"
                    placeholder="Enter search query..."
                    value={this.state.searchQuery}
                    onChange={event =>
                      this.setState({ searchQuery: event.target.value })
                    }
                  />
                </Form.Group>
                <div className="input-group">
                  <div className="custom-file">
                    <input
                      webkitdirectory="True"
                      multiple
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      aria-describedby="inputGroupFileAddon01"
                      onChange={this.handleFiles}
                      onClick={this.handleClick}
                      ref={this.fileInput}
                    />
                    <label
                      className="custom-file-label"
                      htmlFor="inputGroupFile01"
                    >
                      Choose a directory...
                    </label>
                  </div>
                  <div className="input-group-append">
                    <span className="input-group-text" id="">
                      Scan
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className={"mt-2 " + this.state.barVisible}>
          <Col>
            <Card className="text-center">
              <Card.Body>
                <ProgressBar animated now={this.state.searchProgress} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className={"mt-2 " + this.state.dataVisible}>
          <Col>
            <Card className="text-center">
              <Card.Body>
                <ul>
                  {this.state.fileNames.map((fileName, index) => {
                    return (
                      <li key={index}>
                        <p>{fileName}</p>
                      </li>
                    );
                  })}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  };
}

export default App;
