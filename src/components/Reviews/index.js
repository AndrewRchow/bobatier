import React from 'react';
import StarRatings from 'react-star-ratings';

import { withFirebase } from '../Firebase';
import { withAuthorization, AuthUserContext } from '../Session';
import classes from './review.module.css';
import Modal from './reviewModal';



class Reviews extends React.Component {
    static contextType = AuthUserContext;

    constructor(props) {
        super(props);

        this.state = {
            reviews: {},
            sortedReviews: [],
            sortedReviewsCopy: [],
            comment: "",
            modalIsOpen: false,
        }
    }

    componentDidMount() {
        this.getAllReviewList();
    }

    getAllReviewList() {
        this.props.firebase.bobaShopReviews().on('value', snapshot => {
            const reviewsObject = snapshot.val();
            if (reviewsObject) {
                this.setState({
                    reviews: reviewsObject,
                }, () => {
                    this.sortReviews();
                });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.bobaShopReviews().off();
    }


    sortReviews() {
        let sortedReviews = [];
        for (let shop in this.state.reviews) {
            for (let uid in this.state.reviews[shop]) {
                let review = {
                    ...this.state.reviews[shop][uid],
                    shop: shop,
                    uid: uid,
                    // displayAddComment: false,
                    // displayAllComments: false,
                };
                if (review.comments) {

                    review.comments = Object.keys(review.comments).map(key => ({
                        ...review.comments[key],
                        uid: key,
                    }));
                    review.comments.sort(function (a, b) {
                        return new Date(b.dateTime) - new Date(a.dateTime);
                    });
                }
                sortedReviews.push(review);
            }
        }
        sortedReviews.sort(function (a, b) {
            return new Date(b.dateTime) - new Date(a.dateTime);
        });
        console.log(sortedReviews);
        this.setState({ sortedReviews: sortedReviews });
    }

    // addComment(index) {
    //     const newSortedReviews = this.state.sortedReviews.slice();
    //     newSortedReviews[index].displayAddComment = true;
    //     this.setState({ sortedReviews: newSortedReviews });
    // }

    // viewComments(index) {
    //     const newSortedReviews = this.state.sortedReviews.slice();
    //     newSortedReviews[index].displayAllComments = true;
    //     this.setState({ sortedReviews: newSortedReviews });
    // }

    onChange = event => {
        this.setState({ comment: event.target.value });
    };

    submitComment(shop, uid) {
        const comment = this.state.comment;
        const username = this.context.username;
        const dateTime = new Date().toLocaleString();

        this.props.firebase
            .bobaShopUserComment(shop, uid)
            .push({
                comment,
                username,
                uid,
                dateTime
            })
            .then(() => {
                this.setState({ comment: "" });
            });
        //TODO : Change so that when saving reviews, comments doesn't get overridden
    }

    toggleModal = () => {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen
        });
        console.log(this.state.modalIsOpen);
    }

    render() {
        const { sortedReviews } = this.state;

        return (
            <div>
                <Modal show={this.state.modalIsOpen}
                    onClose={this.toggleModal}>
                    Here's some content for the modal
                </Modal>
                <div className={`container`}>
                    <ul>
                        {sortedReviews.map((review, index) => (
                            <li key={index}>
                                <div className={`${classes.review} ${classes.reviewWell}`}>
                                    {review.shop} --
                                {/* <StarRatings
                                    rating={parseFloat(element.milkTeaScore)}
                                    starRatedColor="#0099ff"
                                    starHoverColor="#66ccff"
                                    numberOfStars={5}
                                    name="milkTeaScore"
                                    starDimension="12px"
                                    starSpacing="2px"
                                    isSelectable="false"
                                />
                                --
                                <StarRatings
                                    rating={parseFloat(element.bobaScore)}
                                    starRatedColor="#0099ff"
                                    starHoverColor="#66ccff"
                                    numberOfStars={5}
                                    name="bobaScore"
                                    starDimension="12px"
                                    starSpacing="2px"
                                    isSelectable="false"
                                />
                                --
                                <StarRatings
                                    rating={parseFloat(element.mouthFeelScore)}
                                    starRatedColor="#0099ff"
                                    starHoverColor="#66ccff"
                                    numberOfStars={5}
                                    name="mouthFeelScore"
                                    starDimension="12px"
                                    starSpacing="2px"
                                    isSelectable="false"
                                /> */}

                                    - {review.milkTeaScore} - {review.bobaScore} - {review.mouthFeelScore} - {review.username}
                                </div>
                                {
                                    review.comments ?
                                        <div className={`${classes.commentWell}`}>
                                            <div>
                                                {review.comments.map((comment, index) => (
                                                    <div key={index}>
                                                        {comment.comment} - {comment.username} - {comment.dateTime}
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                {/* <input name="comment" type="text" value={this.state.comment} onChange={(e) => this.onChange(e)} placeholder="Add comment" />
                                                <button disabled={!this.state.comment} onClick={() => this.submitComment(review.shop, review.uid)}>a</button> */}
                                                <button onClick={this.toggleModal}>
                                                    Open the modal
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        <div className={`${classes.commentWell}`}>
                                            {/* <input name="comment" type="text" value={this.state.comment} onChange={(e) => this.onChange(e)} placeholder="Add comment" />
                                            <button disabled={!this.state.comment} onClick={() => this.submitComment(review.shop, review.uid)}>a</button> */}
                                            <button onClick={this.toggleModal}>
                                                Open the modal
                                            </button>
                                        </div>
                                }
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withFirebase(withAuthorization(condition)(Reviews));



// {
//     element.comments ?
//         <div>
//             <button onClick={() => this.viewComments(index)}>v</button>
//         </div>
//         :
//         <div>
//             <button onClick={() => this.addComment(index)}>a</button>
//         </div>
// }
// {
//     element.displayAddComment ?
//         <div>
//             <input name="comment" type="text" onChange={this.onChange} placeholder="Add comment" />
//             <button onClick={() => this.submitComment(element.shop, element.uid)}>a</button>
//         </div>
//         :
//         <div></div>
// }
// {
//     element.displayAllComments ?
//         <div>
//             <div>
//                 {element.comments.map((element, index) => (
//                     <div key={index}>
//                         {element.comment} - {element.username}
//                     </div>
//                 ))}
//             </div>
//             <div>
//                 <input name="comment" type="text" onChange={this.onChange} placeholder="Add comment" />
//                 <button onClick={() => this.submitComment(element.shop, element.uid)}>a</button>
//             </div>
//         </div>
//         :
//         <div></div>
// }