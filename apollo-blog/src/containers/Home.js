import React from "react" ;
import {Link} from "react-router-dom";
import axios from "axios";

import {
  Container ,
  Card ,
  ListGroup ,
  Button,
  Col ,
  Badge ,
  Alert ,
  Row ,
  Navbar ,

} from 'react-bootstrap';
import { connect } from "react-redux";
// found at https://www.npmjs.com/package/react-bootstrap-icons
import { StarFill  } from 'react-bootstrap-icons';

import RichText from './Misc/RichText';
import LoaderSpinner from './Misc/LoaderSpinner'
import {
  all_articles_url ,

} from "../backend-urls.js" ;

import "../content/css/App.css";
import RegisterEmail from './Misc/RegisterEmail';



class Home extends React.Component {

  state = {
    error: null , //stores the error that comes from the backend
    loading : true , //to determine if the page is loading
    articles : [] , //stores all of the articles retrieved from the database
    pinned_article : null , //stores the data for the pinned article

  }

  componentDidMount(){
    this.setState({
      loading: true ,
    })
    this.handleGetArticles();
  }

  //retrieves all the articles from the database
  handleGetArticles = () => {
    axios
      .get(all_articles_url)
      .then(response => {

        //gets all the information for the article with pinned = true. had to put it in here because this function wouldn't set the state fast enough for another method to access it in the componentDidMount.
        var articles = response.data
        var pinned_article = []
        for(var article_id in articles){
          if (response.data[article_id].pinned ){
            pinned_article.id = articles[article_id].id ;
            pinned_article.title = articles[article_id].title ;
            pinned_article.author = articles[article_id].author ;
            pinned_article.created_date = articles[article_id].created_date ;
            pinned_article.body = articles[article_id].body.substring(0, 500) ;
            break ;
          }
        }

        this.setState({
          loading: false ,
          articles: response.data ,
          pinned_article : pinned_article ,

        })
      })
      .catch(error => {
        this.setState({
          error: error ,
          loading : false
        })
      })
  }



  render(){

    const {
      loading ,
      error ,
      articles ,
      pinned_article ,
      username ,

    } = this.state

    const {
      authenticated ,
      token ,

    } = this.props


    console.log(articles)
    return(

      <React.Fragment>
        <Container>
          <Row>
            <h1 className="verdana-font">
              The Apollo Blog
            </h1>
          </Row>
          <Row>
            {/*this nav with the class is used to make the text grey*/}
            <nav className="navbar-light">
              <Navbar.Text><h5 className="verdana-font ">Updates, news, and stories from the future of ecommerce</h5></Navbar.Text>
            </nav>
          </Row>
          <Row>
            <Col >
              {
                authenticated ?
                  token === "8eb05e1e2a096148f4686c071328cd1fbdec1904" &&
                    <div className="float-right">
                      <Link to="/create-article" >
                        <Button variant="outline-secondary">Write an Article </Button>
                      </Link>
                    </div>
                :
                  <div className="float-right">
                    <RegisterEmail text="Sign up for email updates" direction="left"/>
                  </div>
              }
            </Col>
          </Row>
        </Container>
        <hr />
        
        <ListGroup variant="flush" className="bg-app">

            {/* cannot put this inside the "loading === true" ternary below for some reason*/
            loading === false &&
              pinned_article !== null &&
                <ListGroup.Item className="bg-app">
                  <Link to={'blog/article/'+pinned_article.id} className="article-link">
                    <Card className="width-100-percent " id={pinned_article.id}>
                      <Card.Body>
                        <Card.Title>{pinned_article.title} <StarFill color="royalblue" className="float-right font-size-1-25em" /></Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          By {pinned_article.author}, <Badge>{new Date(pinned_article.created_date).toDateString() } </Badge>
                        </Card.Subtitle>
                        <Card.Text >
                          <RichText text={pinned_article.body +"..." } />
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </ListGroup.Item>
            }
            {
              loading === true ?
                <LoaderSpinner />
              :
                articles.length > 0 ?
                  articles.map(article =>  (
                      <ListGroup.Item className="bg-app">
                        <Link to={'blog/article/'+article.id} className="article-link">
                          <Card className="width-100-percent" id={article.id}>
                            <Card.Body>
                              <Card.Title>{article.title}</Card.Title>
                              <Card.Subtitle className="mb-2 text-muted">By {article.author}, <Badge>{new Date(article.created_date).toDateString() } </Badge></Card.Subtitle>
                              <Card.Text >
                                <RichText text={article.body.substring(0, 200) + '...'} />
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Link>
                      </ListGroup.Item>
                    )
                  )
                :
                  <Alert variant="dark">
                    There was an error retrieving our articles
                  </Alert>
          }
        </ListGroup>
      </ React.Fragment>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    token : state.auth.token ,
    authenticated: state.auth.token !== null ,
    username : state.auth.username
  }
}


export default
  connect(
    mapStateToProps,

  )(Home) ;
