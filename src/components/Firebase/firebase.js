import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => {
    this.auth.signOut();
  }
    

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);
  bobaShopUserReview = (shopName, userId) => this.db.ref(`bobaShopUserReviews/${shopName}/${userId}`);
  bobaShopUserComment = (shopName, userId) => this.db.ref(`bobaShopUserReviews/${shopName}/${userId}/comments`);
  userReview = (userId, shopName) => this.db.ref(`users/${userId}/reviews/${shopName}`);
  bobaShop = (bobaShop) => this.db.ref(`bobaShops/${bobaShop}`);

  bobaShopReviews = () => this.db.ref(`bobaShopUserReviews`);
  bobaShopUserReviews = (shopName) => this.db.ref(`bobaShopUserReviews/${shopName}`);
  userReviews = (userId) => this.db.ref(`users/${userId}/reviews`);
  users = () => this.db.ref('users');
  bobaShops = () => this.db.ref('bobaShops');
}

export default Firebase;
