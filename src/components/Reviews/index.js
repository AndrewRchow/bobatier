import React from 'react';

import { withFirebase } from '../Firebase';

class Reviews extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: {},
            sortedReviews: []
        }

    }

    componentWillMount() {
        this.getAllReviewList();
    }

    componentDidMount() {
        this.getAllReviewList();
    }

    getAllReviewList() {
        this.props.firebase.bobaShopReviews().on('value', snapshot => {
            const reviewsObject = snapshot.val();
            console.log(reviewsObject);
            if (reviewsObject) {
                this.setState({
                    reviews: reviewsObject,
                }, () => {
                    this.sortReviews();
                });
            }
        });
    }


    sortReviews() {
        let sortedReviews = [];
        for (let shop in this.state.reviews) {
            for (let user in this.state.reviews[shop]) {
                let review = {
                    ...this.state.reviews[shop][user],
                    shop: shop,
                    user: user
                }
                sortedReviews.push(review);
            }
        }
        sortedReviews.sort(function (a, b) {
            return new Date(b.dateTime) - new Date(a.dateTime);
        });
        this.setState({ sortedReviews: sortedReviews });
    }

    render() {
        const { sortedReviews } = this.state;

        return (
            <ul>
                {sortedReviews.map((element, index) => (
                    <li key={index}>
                        <span>
                            {element.shop} - {element.milkTeaScore} - {element.bobaScore} - {element.mouthFeelScore} - {element.username}
                        </span>
                        <button onClick={() => this.props.addComment()}>e</button>
                    </li>
                ))}
            </ul>
        );
    }
}


export default withFirebase(Reviews);
