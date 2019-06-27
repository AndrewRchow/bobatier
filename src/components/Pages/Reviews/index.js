import React from 'react';
import StarRatings from 'react-star-ratings';

import { withFirebase } from '../../Firebase';
import { withAuthorization, AuthUserContext } from '../../Session';
import classes from './review.module.css';
import Modal from './reviewModal';

const dateOptions = { weekday: 'long', hour: 'numeric', minute: 'numeric', year: 'numeric', month: 'short', day: 'numeric' };

class Reviews extends React.Component {
    static contextType = AuthUserContext;

    constructor(props) {
        super(props);

        this.state = {
            reviews: {},
            sortedReviews: [],
            sortedReviewsCopy: [],
            commentModal: {
                comment: "",
                shop: "",
                uid: ""
            },
            modalIsOpen: false,
            currentTime: new Date(),
        }

        this.submitComment = this.submitComment.bind(this);
        this.changeComment = this.changeComment.bind(this);
    }

    componentDidMount() {
        this.getAllReviewList();
        this.interval = setInterval(() => this.setState({ currentTime: new Date() }), 1000);
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
        clearInterval(this.interval);
    }


    sortReviews() {
        let sortedReviews = [];
        for (let shop in this.state.reviews) {
            for (let uid in this.state.reviews[shop]) {
                let review = {
                    ...this.state.reviews[shop][uid],
                    shop: shop,
                    uid: uid,
                };
                if (review.comments) {

                    review.comments = Object.keys(review.comments).map(key => ({
                        ...review.comments[key],
                        uid: key,
                    }));
                    review.comments.sort(function (a, b) {
                        return new Date(a.dateTime) - new Date(b.dateTime);
                    });
                }
                sortedReviews.push(review);
            }
        }
        sortedReviews.sort(function (a, b) {
            return new Date(b.dateTime) - new Date(a.dateTime);
        });
        console.log(sortedReviews);
        sortedReviews = sortedReviews.splice(0, 50); //show top 50 reviews
        this.setState({ sortedReviews: sortedReviews });
    }

    toggleModal = (shop, uid) => {
        const commentModal = { ...this.state.commentModal };
        commentModal.shop = shop;
        commentModal.uid = uid;

        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            commentModal: commentModal
        });
    }

    changeComment = event => {
        const commentModal = { ...this.state.commentModal };
        commentModal.comment = event.target.value;

        this.setState({
            commentModal: commentModal
        });
    };

    submitComment(shop, uid) {
        const comment = this.state.commentModal.comment;
        const username = this.context.username;
        let dateTime = new Date();
        dateTime.setSeconds(dateTime.getSeconds() + 1);
        dateTime = dateTime.toLocaleString();

        this.props.firebase
            .bobaShopUserComment(shop, uid)
            .push({
                comment,
                username,
                uid,
                dateTime
            })
            .then(() => {
                this.setState({
                    modalIsOpen: !this.state.modalIsOpen,
                    ommentModal: {
                        comment: "",
                        shop: "",
                        uid: ""
                    }
                });
            });
    }

    render() {
        const { sortedReviews, currentTime } = this.state;
        const authUser = this.context.username;
        console.log(authUser);

        return (
            <div>
                <div className={`container ${classes.recentReviews}`}>
                    {sortedReviews === undefined || sortedReviews.length == 0 ?
                        <div className={`${classes.reviewWell}`}>
                            No Recent Reviews.
            </div>
                        :
                        <ul>
                            {sortedReviews.map((review, index) => (
                                <li key={index}>
                                    <div className={`${classes.review} ${classes.reviewWell}`}>
                                        <h4>{review.shop} - {review.username}</h4>
                                        <div className={`row`}>
                                            <div className={`col-sm-6`}>
                                                <div className={`row`}>
                                                    <div className={`col-sm-3`}>
                                                        <p>Score 1</p>
                                                        <StarRatings
                                                            rating={parseFloat(review.score1)}
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
                                                            rating={parseFloat(review.score2)}
                                                            starRatedColor="#0099ff"
                                                            starHoverColor="#66ccff"
                                                            numberOfStars={5}
                                                            name="score2"
                                                            starDimension="12px"
                                                            starSpacing="2px"
                                                            isSelectable="false"
                                                        />
                                                    </div>
                                                    <div className={`col-sm-3`}>
                                                        <p>Score 3</p>
                                                        <StarRatings
                                                            rating={parseFloat(review.score3)}
                                                            starRatedColor="#0099ff"
                                                            starHoverColor="#66ccff"
                                                            numberOfStars={5}
                                                            name="score3"
                                                            starDimension="12px"
                                                            starSpacing="2px"
                                                            isSelectable="false"
                                                        />
                                                    </div>
                                                    <div className={`col-sm-3`}>
                                                        <p>Score 4</p>
                                                        <StarRatings
                                                            rating={parseFloat(review.score4)}
                                                            starRatedColor="#0099ff"
                                                            starHoverColor="#66ccff"
                                                            numberOfStars={5}
                                                            name="score4"
                                                            starDimension="12px"
                                                            starSpacing="2px"
                                                            isSelectable="false"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`col-sm-6`}>
                                                <div className={`row`}>
                                                    <div className={`col-sm-3`}>
                                                        <p>Score 5</p>
                                                        <StarRatings
                                                            rating={parseFloat(review.score5)}
                                                            starRatedColor="#0099ff"
                                                            starHoverColor="#66ccff"
                                                            numberOfStars={5}
                                                            name="score5"
                                                            starDimension="12px"
                                                            starSpacing="2px"
                                                            isSelectable="false"
                                                        />
                                                    </div>
                                                    <div className={`col-sm-3`}>
                                                        <p>Score 6</p>
                                                        <StarRatings
                                                            rating={parseFloat(review.score6)}
                                                            starRatedColor="#0099ff"
                                                            starHoverColor="#66ccff"
                                                            numberOfStars={5}
                                                            name="score6"
                                                            starDimension="12px"
                                                            starSpacing="2px"
                                                            isSelectable="false"
                                                        />
                                                    </div>
                                                    <div className={`col-sm-3`}>
                                                        <p>Score 7</p>
                                                        <StarRatings
                                                            rating={parseFloat(review.score7)}
                                                            starRatedColor="#0099ff"
                                                            starHoverColor="#66ccff"
                                                            numberOfStars={5}
                                                            name="score7"
                                                            starDimension="12px"
                                                            starSpacing="2px"
                                                            isSelectable="false"
                                                        />
                                                    </div>
                                                    <div className={`col-sm-3`}>
                                                        <p>Score 8</p>
                                                        <StarRatings
                                                            rating={parseFloat(review.score8)}
                                                            starRatedColor="#0099ff"
                                                            starHoverColor="#66ccff"
                                                            numberOfStars={5}
                                                            name="score8"
                                                            starDimension="12px"
                                                            starSpacing="2px"
                                                            isSelectable="false"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <i> {new Date(review.dateTime).toLocaleDateString("en-US", dateOptions)}</i>
                                        </div>
                                    </div>
                                    {
                                        review.comments ?
                                            <div className={`${classes.commentsWell}`}>
                                                <div>
                                                    {review.comments.map((comment, index) => (
                                                        <div key={index} className={`${classes.commentWell}`}>
                                                            <div className={(comment.dateTime > currentTime.toLocaleString() ? classes.recentComment : "")}>
                                                                <p>{comment.comment}</p>
                                                                <p><i>{comment.username} - {new Date(comment.dateTime).toLocaleDateString("en-US", dateOptions)}</i></p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    {
                                                        authUser ?
                                                            <button className={`btn btn-info ${classes.addCommentButton}`} onClick={() => this.toggleModal(review.shop, review.uid)}>
                                                                Comment
                                                            </button>
                                                            : <div></div>
                                                    }

                                                </div>
                                            </div>
                                            :
                                            authUser ?
                                                <div className={`${classes.commentsWell}`}>
                                                    <button className={`btn btn-info ${classes.addCommentButton}`} onClick={() => this.toggleModal(review.shop, review.uid)}>
                                                        Comment
                                                            </button>
                                                </div>
                                                :
                                                <div></div>
                                    }
                                </li>
                            ))}
                        </ul>
                    }
                </div>
                <Modal show={this.state.modalIsOpen}
                    onClose={this.toggleModal}
                    commentModal={this.state.commentModal}
                    changeComment={this.changeComment}
                    submitComment={this.submitComment}>
                    Add a comment
                </Modal>
            </div>
        );
    }
}

// const condition = authUser => !!authUser;
// export default withFirebase(withAuthorization(condition)(Reviews));
export default withFirebase(Reviews);



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