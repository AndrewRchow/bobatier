import React from 'react';
import { withFirebase } from '../../Firebase';
import classes from './shops.module.css'
import { Link } from 'react-router-dom';
import * as ROUTES from '../../../constants/routes';

import AutoSuggestShops from '../../ThirdParty/AutoSuggestShops/index';
import StarRatings from 'react-star-ratings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'




class Shops extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shop: '',
            shopReviews: [],
            numberOfReviews: 0
        }

        this.getAutosuggestInput = this.getAutosuggestInput.bind(this);
        this.getAutoSuggestSelected = this.getAutoSuggestSelected.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state) {
            const shop = this.props.location.state.shop;
            this.getShopReviews(shop);
        }
    }

    getAutosuggestInput(value) {
    }
    getAutoSuggestSelected(value) {
        this.getShopReviews(value);
    }

    getShopReviews(shop) {
        this.setState({ shop: shop });

        this.props.firebase.bobaShopUserReviews(shop).on('value', snapshot => {
            const shopReviewsObject = snapshot.val();
            console.log(shopReviewsObject);
            if (shopReviewsObject) {
                const shopReviewsList = Object.keys(shopReviewsObject).map(key => ({
                    userid: key,
                    ...shopReviewsObject[key],
                }))

                this.setState({
                    shopReviews: shopReviewsList,
                    numberOfReviews: shopReviewsList.length
                });
            } else{
                this.setState({
                    shopReviews: [],
                    numberOfReviews: 0
                })
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.bobaShopUserReviews().off();
    }

    render() {
        const { shop, shopReviews, numberOfReviews } = this.state;
        console.log(shopReviews);
        return (
            <div>
                <h5>Shop</h5>
                <AutoSuggestShops
                    getInputData={this.getAutosuggestInput}
                    getSelectedData={this.getAutoSuggestSelected}
                    bobaShop={shop} />


                <div>

                    {shopReviews === undefined || shopReviews.length == 0 ?
                        <div>
                        </div>
                        :
                        <div>
                            <h5>{shop} -  <FontAwesomeIcon icon={faUsers} size="1x" />{numberOfReviews}</h5>
                            <ul>
                                {shopReviews.map(review => (
                                    <li key={review.userid} className={`${classes.well}`}>
                                        <div>
                                        <Link to={{ pathname: process.env.PUBLIC_URL + ROUTES.USERS, state: { userid: review.userid, username: review.username } }}>
                                            {review.username}
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

export default withFirebase(Shops);