import React from "react" ;
import {Link} from "react-router-dom";
import axios from "axios";

import {
  Container ,
  Card ,
  ListGroup ,
  Col ,
  Badge ,
  Alert ,
  Row ,
  Navbar ,

} from 'react-bootstrap';
import { connect } from "react-redux";
import { Event, PageView } from "../GlobalMisc/Tracking";

import RichText from '../GlobalMisc/RichText';
import LoaderSpinner from '../GlobalMisc/LoaderSpinner'
import PinnedArticle from './Misc/PinnedArticle';

import {
  all_articles_url ,

} from "../../backend-urls.js" ;

import "../../content/css/App.css";



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
    PageView();

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
            <h1 className="ubuntu-bold-font">
              The Apollo Blog
            </h1>
          </Row>
          <Row>
            {/*this nav with the class is used to make the text grey*/}
            <nav className="navbar-light">
              <Navbar.Text><h5 className="ubuntu-bold-font">Updates, news, and stories from the future of ecommerce</h5></Navbar.Text>
            </nav>
          </Row>
          <Row>
            <Col >

            </Col>
          </Row>
        </Container>
        <hr />

        <ListGroup variant="flush" className="bg-app">

            {/* cannot put this inside the "loading === true" ternary below for some reason*/
              loading === false &&
                /*This prevents the pinned_article from displaying if loading is false... it runs parallel to the logic of LoaderSpinner in the following ternary -> If loading, display the LoaderSpinner and don't display pinned article   */
                pinned_article !== null &&
                  <PinnedArticle pinned_article={pinned_article} />
            }
            {
              loading === true ?
                <LoaderSpinner />
              :
                articles.length > 0 ?
                  articles.map(article =>  (
                      <ListGroup.Item className="bg-app">
                        <Link to={'blog/article/'+article.id} className="article-link" onClick={()=> Event("Routing", "Opening Pinned Article;; id = " + article.id, "From Home Page")}>
                          <Card
                            className="width-100-percent border-radius-25px "
                            id={article.id}
                          >
                            <Card.Body>
                              <Card.Title className="roboto-bold-font">
                                {article.title}
                              </Card.Title>
                              <Card.Subtitle className="mb-2 text-muted roboto-regular-font">
                                By {article.author}, <Badge>{new Date(article.created_date).toDateString() } </Badge>
                              </Card.Subtitle>
                              <Card.Text className="roboto-regular-font" >
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
