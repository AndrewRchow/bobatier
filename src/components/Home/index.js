import React from 'react';
import classes from './home.module.css';

import { withAuthorization, AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

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
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <NewReview formValues={this.state.formValues} />
        </div>
        <div  className="col-md-6">
          <MyReviews editReview={this.editFormValues} />
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
      .set({
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
      .set({
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
      <form onSubmit={this.onSubmit}>
        <input
          name="bobaShop"
          value={bobaShop}
          onChange={this.onChange}
          type="text"
          placeholder="Boba Shop"
        />
        <input
          name="milkTeaScore"
          value={milkTeaScore}
          onChange={this.onChange}
          type="number"
          placeholder="Milk Tea Score"
        />
        <input
          name="bobaScore"
          value={bobaScore}
          onChange={this.onChange}
          type="number"
          placeholder="Boba Score"
        />
        <input
          name="mouthFeelScore"
          value={mouthFeelScore}
          onChange={this.onChange}
          type="number"
          placeholder="Mouth Feel Score"
        />

        <button disabled={isInvalid} type="submit">
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

  componentWillMount() {
    this.getReviewList();
  }

  deleteReview(key) {
    this.props.firebase.userReviews(this.context.authUser.uid).child(key).remove();
    this.props.firebase.bobaShopUserReviews(key).child(this.context.authUser.uid).remove();
    this.getReviewList();
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
