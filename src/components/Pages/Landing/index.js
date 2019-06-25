import React from 'react';
import { withFirebase } from '../../Firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

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
    let reviewCount = 0;
    let grades = {};

    for (let shop in this.state.reviews) {
      for (let user in this.state.reviews[shop]) {
        let userReview = this.state.reviews[shop][user];
        bobaTotal += userReview.bobaScore;
        milkTeaTotal += userReview.milkTeaScore;
        mouthFeelTotal += userReview.mouthFeelScore;
        count++;
        reviewCount++;
      }

      finalScore = (parseFloat(bobaTotal) + parseFloat(milkTeaTotal) + parseFloat(mouthFeelTotal)) / (count * 3);
      grades[shop] = {
        shopName: shop,
        finalScore: finalScore,
        reviewCount: reviewCount
      }

      count = bobaTotal = milkTeaTotal = mouthFeelTotal = reviewCount = 0;
    }

    const orderedGrades = {};
    Object.keys(grades).sort().forEach(function (key) {
      orderedGrades[key] = grades[key];
    });

    this.setState({
      grades: orderedGrades
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
      const score = grades[shop].finalScore;
      const name = grades[shop].shopName;
      console.log(score, name);

      if (score >= 5) {
        tierList.SS.push(name)
      } else if (4.75 <= score && score < 5) {
        tierList.S.push(name)
      } else if (4.25 <= score && score < 4.75) {
        tierList.A.push(name)
      } else if (3.5 <= score && score < 4.25) {
        tierList.B.push(name)
      } else if (2.75 <= score && score < 3.5) {
        tierList.C.push(name)
      } else if (2 <= score && score < 2.75) {
        tierList.D.push(name)
      } else if (score < 2) {
        tierList.E.push(name)
      }
    }

    this.setState({
      tierList: tierList
    });
    console.log(tierList);
    console.log(grades);
  }

  componentWillUnmount() {
    this.props.firebase.bobaShopReviews().off();
  }

  render() {
    const { grades } = this.state;
    const { tierList } = this.state;

    const divStyle = {
      display: 'inline',
    };

    const tiersStyle = {
      padding: '3px'
    }

    const buttonStyle= {
      color: 'black',
      border: '1px solid #ccc',

    }

    return (
      <div>
        <div>
          <h5>TL</h5>
          <ul>
            {Object.entries(tierList).map(([tier, list]) => (
              <li key={tier} style={tiersStyle}>
                <button className={`btn btn-default`} style={buttonStyle}>{tier}</button> -{' '}

                {
                  list.map((shop, index) => (
                    <div key={index} style={divStyle}>
                      {shop}, {' '}
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
        <div>
          <h5>Scores</h5>
          <ul>
            {Object.keys(grades).map((shop, i) => (
              <li key={i}>
                <span>
                  {grades[shop].shopName} - {' '}
                  <FontAwesomeIcon icon={faStar} size="sm" />
                  {Math.round(grades[shop].finalScore * 100) / 100} - {' '}
                  <FontAwesomeIcon icon={faUsers} size="sm" />
                  {grades[shop].reviewCount}
                </span>
              </li>
            ))}
          </ul>

        </div>
      </div>

    )
  }
}


export default withFirebase(Landing);