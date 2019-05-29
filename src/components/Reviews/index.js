import React from 'react';

import { withFirebase } from '../Firebase';

class Reviews extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reviews: {},
            sortedReviews: [],
            comment: null,
        }

    }

    componentWillMount() {
        this.getAllReviewList();
    }

    // componentDidMount() {
    //     this.getAllReviewList();
    // }

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
                    user: user,
                    displayAddComment: false,
                    displayAllComments: false,
                }
                sortedReviews.push(review);
            }
        }
        sortedReviews.sort(function (a, b) {
            return new Date(b.dateTime) - new Date(a.dateTime);
        });
        this.setState({ sortedReviews: sortedReviews });
    }

    addComment(index) {
        const newSortedReviews = this.state.sortedReviews.slice();
        newSortedReviews[index].displayAddComment = true;
        this.setState({ sortedReviews: newSortedReviews });
    }

    viewComments(index) {
        const newSortedReviews = this.state.sortedReviews.slice();
        newSortedReviews[index].displayAllComments = true;
        this.setState({ sortedReviews: newSortedReviews });
        console.log(this.state);
    }

    onChange = event => {
        this.setState({ comment: event.target.value });
    };

    submitComment(shop, username) {
        console.log(shop, username);
        const comment = this.state.comment;

        this.props.firebase
            .bobaShopUserComment(shop, username)
            .push({
                comment
            })
            .then(() => {
                this.setState({ comment: null });
            });
        //TODO : Change so that when saving reviews, comments doesn't get overridden
    }


    render() {
        // const { sortedReviews } = this.state;

        return (
            <div>
                <ul>
                    {this.state.sortedReviews.map((element, index) => (
                        <li key={index}>
                            <span>
                                {element.shop} - {element.milkTeaScore} - {element.bobaScore} - {element.mouthFeelScore} - {element.username}
                            </span>
                            {
                                element.comments ?
                                    <div>
                                        <button onClick={() => this.viewComments(index)}>v</button>
                                    </div>
                                    :
                                    <div>
                                        <button onClick={() => this.addComment(index)}>a</button>
                                    </div>
                            }
                            {
                                element.displayAddComment ?
                                    <div>
                                        <input name="comment" type="text" onChange={this.onChange} placeholder="Add comment" />
                                        <button onClick={() => this.submitComment(element.shop, element.user)}>a</button>
                                    </div>
                                    :
                                    <div></div>
                            }
                            {
                                element.displayAllComments ?
                                    <div>
                                        {Object.entries(element.comments).map((comment) => (
                                            <div key={comment}>
                                                    {comment.comment}
                                            </div>
                                        ))}
                                    </div>
                                    :
                                    <div></div>
                            }


                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}


export default withFirebase(Reviews);
