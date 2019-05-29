import React from 'react';
import { withFirebase } from '../Firebase';


class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: {},
      grades: {}
    }

  }

  componentWillMount() {
    this.getAllReviewList();
  }
  
  // componentDidMount() {
  //   this.getAllReviewList();
  // }

  getAllReviewList() {
    this.props.firebase.bobaShopReviews().on('value', snapshot => {
      const reviewsObject = snapshot.val();
      if (reviewsObject) {
        this.setState({
          reviews: reviewsObject,
        }, () =>{
          this.gradeReviews();
        });
      }
    });
  }

  gradeReviews() {
    let count = 0;
    let bobaTotal, milkTeaTotal, mouthFeelTotal = 0;
    let grades = {};

    for (let shop in this.state.reviews) {
      for(let user in this.state.reviews[shop]) {
        let userReview = this.state.reviews[shop][user];
        bobaTotal += userReview.bobaScore;
        milkTeaTotal += userReview.milkTeaScore;
        mouthFeelTotal += userReview.mouthFeelScore;
        count++;
      }

      let finalScore = (parseFloat(bobaTotal) + parseFloat(milkTeaTotal) + parseFloat(mouthFeelTotal))/(count*3);
      grades[shop] = finalScore;

      count = bobaTotal = milkTeaTotal = mouthFeelTotal = 0;
    }

    this.setState({
      grades: grades
    })
  }


  render() {
    const { grades } = this.state;

    return (
      <ul>
        {Object.entries(grades).map(([shopName, finalScore]) => (
          <li key={shopName}>
            <span>
              {shopName}
            </span>
            <span>
              - {finalScore}
            </span>
          </li>
        ))}
      </ul>
    )
  }
}


export default withFirebase(Landing);