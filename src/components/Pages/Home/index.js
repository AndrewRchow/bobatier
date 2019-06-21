import React from 'react';
import classes from './home.module.css';

import { withAuthorization, AuthUserContext } from '../../Session';
import { withFirebase } from '../../Firebase';
import StarRatings from 'react-star-ratings';
import AutoSuggestBobaShops from '../../ThirdParty/AutoSuggest/index';

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
    this.editFormValues = this.editFormValues.bind(this);
  }

  editFormValues(params) {
    params.milkTeaScore = parseInt(params.milkTeaScore);
    params.bobaScore = parseInt(params.bobaScore);
    params.mouthFeelScore = parseInt(params.mouthFeelScore);
    this.setState({ formValues: params });
    window.scrollTo(0, 0);
  }

  render() {

    // <div className={`col-sm-6" ${classes.scroll}`}></div>
    return (
      <div className={classes.Content}>
        <div className={`row" ${classes.Wrapper}`}>
          <div className={`col-sm-6" ${classes.left}`}>
            <NewReview formValues={this.state.formValues} />
          </div>
          <div className={`col-sm-6" ${classes.right}`}>
            <MyReviews editReview={this.editFormValues} />
          </div>
        </div>
      </div>
    );
  }

}


class NewReviewBase extends React.Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);
    this.state = props.formValues;
    this.getAutosuggestInput = this.getAutosuggestInput.bind(this);
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
    const comment = "";

    this.props.firebase
      .bobaShopUserReview(bobaShop, userId)
      .update({
        username,
        milkTeaScore,
        bobaScore,
        mouthFeelScore,
        dateTime,
        comment
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
      .catch(error => {
        this.setState({ error });
      });

    this.props.firebase
      .bobaShop(bobaShop)
      .update({
        bobaShop,
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

  getAutosuggestInput(value) {
    this.setState({ bobaShop: value })
  }

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
        <AutoSuggestBobaShops getInputData={this.getAutosuggestInput} bobaShop={bobaShop} />
        {/* <input
          name="bobaShop"
          className={classes.reviewInput}
          value={bobaShop}
          onChange={this.onChange}
          type="text"
          placeholder="Shop"
        /> */}
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

        <button className={`btn btn-primary ${classes.submitButton}`} disabled={isInvalid} type="submit">
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
      this.props.firebase.bobaShops().child(key).remove();
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
          <li key={review.bobaShop} className={`${classes.well}`}>
            <div>
              {review.bobaShop} - {review.milkTeaScore} - {review.bobaScore} - {review.mouthFeelScore}
            </div>
            <div>
              <button className={`btn btn-info ${classes.updateButton}`} onClick={() => this.props.editReview(review)}>Edit</button>
              <button className={`btn btn-danger ${classes.updateButton}`} onClick={() => this.deleteReview(review.bobaShop)}>Delete</button>
            </div>
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