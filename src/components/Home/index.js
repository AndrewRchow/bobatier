import React from 'react';
import classes from './home.module.css';

import { withAuthorization, AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import StarRatings from 'react-star-ratings';

const INITIAL_STATE = {
  bobaShop: '',
  milkTeaScore: 1,
  bobaScore: 1,
  mouthFeelScore: 1,
  error: null,
};

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formValues: INITIAL_STATE };
    this.editFormValues = this.editFormValues.bind(this)
  }

  editFormValues(params) {
    this.setState({ formValues: params });
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <NewReview formValues={this.state.formValues} />
        <MyReviews editReview={this.editFormValues} />
      </div>
    );
  }

}


class NewReviewBase extends React.Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
    this.state = props.formValues;
  }

  componentWillReceiveProps(props) {
    this.setState(props.formValues);
  }

  onSubmit = event => {
    event.preventDefault();

    const { bobaShop, milkTeaScore, bobaScore, mouthFeelScore } = this.state;
    const dateTime = new Date().toLocaleString();
    const userId = this.context.authUser.uid;
    const username = this.context.username;

    this.props.firebase
      .bobaShopUserReview(bobaShop, userId)
      .update({
        username,
        milkTeaScore,
        bobaScore,
        mouthFeelScore,
        dateTime,
      })
      .catch(error => {
        this.setState({ error });
      });

    this.props.firebase
      .userReview(userId, bobaShop)
      .update({
        username,
        milkTeaScore,
        bobaScore,
        mouthFeelScore,
        dateTime,
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeScore = (rating, name) => {
    this.setState({ [name]: rating });
  };


  render() {
    const {
      bobaShop,
      milkTeaScore,
      bobaScore,
      mouthFeelScore,
      error,
    } = this.state;

    const isInvalid =
      bobaShop === '' ||
      milkTeaScore === '' ||
      bobaScore === '' ||
      mouthFeelScore === '';

    return (



      <form onSubmit={this.onSubmit} className={classes.submitForm}>
        <input
          name="bobaShop"
          className={classes.reviewInput}
          value={bobaShop}
          onChange={this.onChange}
          type="text"
          placeholder="Shop"
        />
        <div className={classes.starRating}>
          <StarRatings
            rating={milkTeaScore}
            starRatedColor="#0099ff"
            starHoverColor="#66ccff"
            changeRating={this.onChangeScore}
            numberOfStars={5}
            name="milkTeaScore"
            starDimension="20px"
          />
        </div>
        <div className={classes.starRating}>
          <StarRatings
            rating={bobaScore}
            starRatedColor="#0099ff"
            starHoverColor="#66ccff"
            changeRating={this.onChangeScore}
            numberOfStars={5}
            name="bobaScore"
            starDimension="20px"
          />
        </div>
        <div className={classes.starRating}>
          <StarRatings
            rating={mouthFeelScore}
            starRatedColor="#0099ff"
            starHoverColor="#66ccff"
            changeRating={this.onChangeScore}
            numberOfStars={5}
            name="mouthFeelScore"
            starDimension="20px"
          />
        </div>

        <button className={classes.submitButton} disabled={isInvalid} type="submit">
          Submit
      </button>

        {error && <p>{error.message}</p>}
      </form>
    )
  }
}

class MyReviewsBase extends React.Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);

    this.state = {
      myReviews: [],
    };
  }

  componentDidMount() {
    this.getReviewList();
  }

  deleteReview(key) {
    var result = window.confirm("Are you sure you want to delete?");
    if (result) {
      this.props.firebase.userReviews(this.context.authUser.uid).child(key).remove();
      this.props.firebase.bobaShopUserReviews(key).child(this.context.authUser.uid).remove();  
    }
  }

  // editReview(event) {
  //   this.props.callback(event.target.value);
  // }

  getReviewList() {
    const userId = this.context.authUser.uid

    this.props.firebase.userReviews(userId).on('value', snapshot => {
      const myReviewsObject = snapshot.val();
      if (myReviewsObject) {
        const myReviewsList = Object.keys(myReviewsObject).map(key => ({
          bobaShop: key,
          ...myReviewsObject[key],
        }))
        this.setState({
          myReviews: myReviewsList,
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.userReviews().off();
  }

  render() {
    const { myReviews } = this.state;

    return (
      <ul>
        {myReviews.map(review => (
          <li key={review.bobaShop}>
            <span>
              {review.bobaShop} -
            </span>
            <span>
              {review.milkTeaScore} -
            </span>
            <span>
              {review.bobaScore} -
            </span>
            <span>
              {review.mouthFeelScore}
            </span>
            <button onClick={() => this.props.editReview(review)}>e</button>
            <button onClick={() => this.deleteReview(review.bobaShop)}>d</button>
          </li>
        ))}
      </ul>
    )
  }
}

const condition = authUser => !!authUser;

const NewReview = withFirebase(withAuthorization(condition)(NewReviewBase));
const MyReviews = withFirebase(withAuthorization(condition)(MyReviewsBase));

export default HomePage;
