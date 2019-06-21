import React from 'react';
import { withFirebase } from '../../Firebase';


class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: {},
      grades: {},
      tierList: {
        S: [],
        A: [],
        B: [],
        C: [],
        D: [],
      }
    }

  }

  componentDidMount() {
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
        }, () => {
          this.gradeReviews();
        });
      }
    });
  }

  gradeReviews() {
    let count = 0; 
    let finalScore = 0;
    let bobaTotal = 0;
    let milkTeaTotal = 0;
    let mouthFeelTotal = 0;
    let grades = {};

    for (let shop in this.state.reviews) {
      for (let user in this.state.reviews[shop]) {
        let userReview = this.state.reviews[shop][user];
        bobaTotal += userReview.bobaScore;
        milkTeaTotal += userReview.milkTeaScore;
        mouthFeelTotal += userReview.mouthFeelScore;
        count++;
      }

      finalScore = (parseFloat(bobaTotal) + parseFloat(milkTeaTotal) + parseFloat(mouthFeelTotal)) / (count * 3);
      grades[shop] = finalScore;

      count = bobaTotal = milkTeaTotal = mouthFeelTotal = 0;
    }

    this.setState({
      grades: grades
    })
    console.log(grades);

    let tierList = {
      SS: [],
      S: [],
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
    }

    for (let shop in grades) {
      if (grades[shop] >= 5) {
        tierList.SS.push(shop)
      } else if (4.75 <= grades[shop] && grades[shop] < 5) {
        tierList.S.push(shop)
      } else if (4.25 <= grades[shop] && grades[shop] < 4.75) {
        tierList.A.push(shop)
      } else if (3.5 <= grades[shop] && grades[shop] < 4.25) {
        tierList.B.push(shop)
      } else if (2.75 <= grades[shop] && grades[shop] < 3.5) {
        tierList.C.push(shop)
      } else if (2 <= grades[shop] && grades[shop] < 2.75) {
        tierList.D.push(shop)
      } else if (grades[shop] < 2) {
        tierList.E.push(shop)
      }
    }

    this.setState({
      tierList: tierList
    });
    console.log(tierList);
  }

  componentWillUnmount() {
    this.props.firebase.bobaShopReviews().off();
  }

  render() {
    const { grades } = this.state;
    const { tierList } = this.state;

    var divStyle = {
      display: 'inline',
    };

    return (
      <div>
        <ul>
          {Object.entries(tierList).map(([tier, list]) => (
            <li key={tier}>
              <span>
                {tier} -
              </span>
              {
                list.map((shop, index) => (
                  <div key={index} style={divStyle}>
                    {shop}.
                  </div>
                ))
              }
            </li>
          ))}
        </ul>

        {/* <ul>
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
        </ul> */}

      </div>
    )
  }
}


export default withFirebase(Landing);