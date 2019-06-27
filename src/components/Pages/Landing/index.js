import React from 'react';
import { withFirebase } from '../../Firebase';
import classes from './landing.module.css';

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
    let score1Total = 0; let score2Total = 0; let score3Total = 0; let score4Total = 0;
    let score5Total = 0; let score6Total = 0; let score7Total = 0; let score8Total = 0;
    let reviewCount = 0;
    let grades = {};

    for (let shop in this.state.reviews) {
      for (let user in this.state.reviews[shop]) {
        let userReview = this.state.reviews[shop][user];
        score1Total += userReview.score1;
        score2Total += userReview.score2;
        score3Total += userReview.score3;
        score4Total += userReview.score4;
        score5Total += userReview.score5;
        score6Total += userReview.score6;
        score7Total += userReview.score7;
        score8Total += userReview.score8;
        count++;
        reviewCount++;
      }

      finalScore = (parseFloat(score1Total) + parseFloat(score2Total) + parseFloat(score3Total) + parseFloat(score4Total) +
        parseFloat(score5Total) + parseFloat(score6Total) + parseFloat(score7Total) + parseFloat(score8Total)) / (count * 8);
      grades[shop] = {
        shopName: shop,
        finalScore: finalScore,
        reviewCount: reviewCount
      }

      count = score1Total = score2Total = score3Total = score4Total = score5Total = score6Total = score7Total = score8Total = reviewCount = 0;
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
      const finalScore = grades[shop].finalScore;
      const name = grades[shop].shopName;

      if (finalScore >= 5) {
        tierList.SS.push(name)
      } else if (4.75 <= finalScore && finalScore < 5) {
        tierList.S.push(name)
      } else if (4.25 <= finalScore && finalScore < 4.75) {
        tierList.A.push(name)
      } else if (3.5 <= finalScore && finalScore < 4.25) {
        tierList.B.push(name)
      } else if (2.75 <= finalScore && finalScore < 3.5) {
        tierList.C.push(name)
      } else if (2 <= finalScore && finalScore < 2.75) {
        tierList.D.push(name)
      } else if (finalScore < 2) {
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

    const buttonStyle = {
      color: 'black',
      border: '1px solid #ccc',

    }

    return (
      <div className={`container`}>
        <div className={`row`}>
          <div className={`col-sm-12`}>
            <h5>Tier List</h5>
            <ul>
              {Object.entries(tierList).map(([tier, list]) => (
                <li key={tier} style={tiersStyle}>
                  <button className={`btn btn-default`} style={buttonStyle}>{tier}</button> &nbsp; &nbsp;
  
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
          </div>
        </div>
        <div className={`row`}>
          <div className={`col-sm-12`}>
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
      </div>

    )
  }
}


export default withFirebase(Landing);