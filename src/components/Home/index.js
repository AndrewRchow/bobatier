import React from 'react';

import { withAuthorization, AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  bobaShop: '',
  milkTeaScore: 0,
  bobaScore: 0,
  mouthFeelScore: 0,
  error: null,
};

const HomePage = () => (
  <div>
    <NewReview />
    <MyReviews />
  </div>
);


class NewReviewBase extends React.Component {
  static contextType = AuthUserContext;

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
  }

  onSubmit = event => {
    event.preventDefault();

    const { bobaShop, milkTeaScore, bobaScore, mouthFeelScore } = this.state;
    const userId = this.context.authUser.uid;

    this.props.firebase
      .bobaShopUserReview(bobaShop, userId)
      .set({
        milkTeaScore,
        bobaScore,
        mouthFeelScore,
      })
      .catch(error => {
        this.setState({ error });
      });

    this.props.firebase
      .userReview(userId, bobaShop)
      .set({
        milkTeaScore,
        bobaScore,
        mouthFeelScore,
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
    const userId = this.context.authUser.uid

    this.props.firebase.userReviews(userId).on('value', snapshot => {
      const myReviewsObject = snapshot.val();
      if (myReviewsObject) {
        const myReviewsList = Object.keys(myReviewsObject).map(key => ({
          shopName: key,
          ...myReviewsObject[key],
        }))
        console.log(myReviewsList);
        this.setState({
          myReviews: myReviewsList,
        });
      }
    });
  }

  deleteReview(key) {
    this.props.firebase.userReviews(this.context.authUser.uid).child(key).remove();
    //TODO
    // Remove other firebase node
    // Update page on delete click
  }

  render() {
    const { myReviews } = this.state;

    return (
      <ul>
        {myReviews.map(review => (
          <li key={review.shopName}>
            <span>
              Shop Name: {review.shopName}
            </span>
            <button onClick={() => this.deleteReview(review.shopName)}></button>
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
