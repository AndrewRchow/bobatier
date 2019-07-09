import React from 'react';
import { withFirebase } from '../../Firebase';
import classes from './users.module.css'
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import AutoSuggestUsers from '../../ThirdParty/AutoSuggestUsers/index';
import StarRatings from 'react-star-ratings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            userReviews: [],
            numberOfReviews: 0
        }

        this.getAutosuggestInput = this.getAutosuggestInput.bind(this);
        this.getAutoSuggestSelected = this.getAutoSuggestSelected.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state) {
            console.log(userid, username);
            const userid = this.props.location.state.userid;
            const username = this.props.location.state.username;
            this.getUserReviews(userid, username);
        }
    }

    getAutosuggestInput(value) {
    }
    getAutoSuggestSelected(value) {
        this.getUserReviews(value.userid, value.username);
    }

    getUserReviews(userid, username) {
        this.setState({ user: username });

        this.props.firebase.userReviews(userid).on('value', snapshot => {
            const userReviewsObject = snapshot.val();
            if (userReviewsObject) {
                const userReviewsList = Object.keys(userReviewsObject).map(key => ({
                    shop: key,
                    ...userReviewsObject[key],
                }))
                this.setState({
                    userReviews: userReviewsList,
                    numberOfReviews: userReviewsList.length
                });
            } else {
                this.setState({
                    userReviews: [],
                    numberOfReviews: 0
                })
            }
        });
    }

    render() {
        const { user, userReviews, numberOfReviews } = this.state;
        console.log(user);

        return (
            <div>
                <h5>User</h5>
                <AutoSuggestUsers
                    getInputData={this.getAutosuggestInput}
                    getSelectedData={this.getAutoSuggestSelected}
                    user={user} />


                <div>

                    {userReviews === undefined || userReviews.length == 0 ?
                        <div>
                        </div>
                        :
                        <div>
                            <h5>{user} -  <FontAwesomeIcon icon={faCoffee} size="1x" />{numberOfReviews}</h5>
                            <ul>
                                {userReviews.map(review => (
                                    <li key={review.shop} className={`${classes.well}`}>
                                        <div>
                                            <Link to={{ pathname: process.env.PUBLIC_URL + ROUTES.SHOPS, state: { shop: review.shop } }}>
                                                {review.shop}
                                            </Link>
                                            <div className={`row`}>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 1</p>
                                                    <StarRatings
                                                        rating={review.score1}
                                                        starRatedColor="#0099ff"
                                                        starHoverColor="#66ccff"
                                                        numberOfStars={5}
                                                        name="score1"
                                                        starDimension="12px"
                                                        starSpacing="2px"
                                                        isSelectable="false"
                                                    />
                                                </div>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 2</p>
                                                    <StarRatings
                                                        rating={review.score2}
                                                        starRatedColor="#0099ff"
                                                        starHoverColor="#66ccff"
                                                        numberOfStars={5}
                                                        name="score1"
                                                        starDimension="12px"
                                                        starSpacing="2px"
                                                        isSelectable="false"
                                                    />
                                                </div>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 3</p>
                                                    <StarRatings
                                                        rating={review.score3}
                                                        starRatedColor="#0099ff"
                                                        starHoverColor="#66ccff"
                                                        numberOfStars={5}
                                                        name="score1"
                                                        starDimension="12px"
                                                        starSpacing="2px"
                                                        isSelectable="false"
                                                    />
                                                </div>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 4</p>
                                                    <StarRatings
                                                        rating={review.score4}
                                                        starRatedColor="#0099ff"
                                                        starHoverColor="#66ccff"
                                                        numberOfStars={5}
                                                        name="score1"
                                                        starDimension="12px"
                                                        starSpacing="2px"
                                                        isSelectable="false"
                                                    />
                                                </div>
                                            </div>
                                            <div className={`row`}>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 5</p>
                                                    <StarRatings
                                                        rating={review.score5}
                                                        starRatedColor="#0099ff"
                                                        starHoverColor="#66ccff"
                                                        numberOfStars={5}
                                                        name="score1"
                                                        starDimension="12px"
                                                        starSpacing="2px"
                                                        isSelectable="false"
                                                    />
                                                </div>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 6</p>
                                                    <StarRatings
                                                        rating={review.score6}
                                                        starRatedColor="#0099ff"
                                                        starHoverColor="#66ccff"
                                                        numberOfStars={5}
                                                        name="score1"
                                                        starDimension="12px"
                                                        starSpacing="2px"
                                                        isSelectable="false"
                                                    />
                                                </div>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 7</p>
                                                    <StarRatings
                                                        rating={review.score7}
                                                        starRatedColor="#0099ff"
                                                        starHoverColor="#66ccff"
                                                        numberOfStars={5}
                                                        name="score1"
                                                        starDimension="12px"
                                                        starSpacing="2px"
                                                        isSelectable="false"
                                                    />
                                                </div>
                                                <div className={`col-sm-3`}>
                                                    <p>Score 8</p>
                                                    <StarRatings
                                                        rating={review.score8}
                                                        starRatedColor="#0099ff"
                                                        starHoverColor="#66ccff"
                                                        numberOfStars={5}
                                                        name="score1"
                                                        starDimension="12px"
                                                        starSpacing="2px"
                                                        isSelectable="false"
                                                    />
                                                </div>
                                            </div>
                                            <div className={`row`}>
                                                <div className={`col-sm-12`}>
                                                    <p>{review.note}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default withFirebase(Users);