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
            <Col sm={{span:4}}>
              <h1 className="verdana-font">
                The Apollo Blog
              </h1>
            </Col>
            <Col sm={{offset:9}}>
              {
                authenticated ?
                  token === "8582b323219d80196bb1e017411808a67fe70365" &&
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
        <br />

        <ListGroup variant="flush">
          {
            pinned_article !== null &&
              <ListGroup.Item >
                 <Link to={'blog/article/'+pinned_article.id} className="article-link">
                   <Card className="width-100-percent margin-bottom-75px" id={pinned_article.id}>
                     <Card.Body>
                       <Card.Title>{pinned_article.title} <StarFill color="royalblue" className="float-right font-size-1-25em" /></Card.Title>
                       <Card.Subtitle className="mb-2 text-muted">By <a href='#'>{pinned_article.author}</a> <Badge>{  new Date(pinned_article.created_date).toDateString() } </Badge></Card.Subtitle>
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
                //reverse() makes the articles appear in reverse chronological order
                articles.map(article =>  (
                    <ListGroup.Item>
                      <Link to={'blog/article/'+article.id} className="article-link">
                        <Card className="width-100-percent" id={article.id}>
                          <Card.Body>
                            <Card.Title>{article.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">By <a href='#'>{article.author}</a> <Badge>{  new Date(article.created_date).toDateString() } </Badge></Card.Subtitle>
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

  }
}


export default
  connect(
    mapStateToProps,

  )(Home) ;
