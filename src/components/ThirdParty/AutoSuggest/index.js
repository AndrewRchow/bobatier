import React from 'react';
import Autosuggest from 'react-autosuggest';
import { withFirebase } from '../../Firebase';
import theme from './theme.css';
// import classes from '*.module.css';

let bobaShops = [
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : bobaShops.filter(shop =>
    shop.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

class AutoSuggestBobaShops extends React.Component {
  constructor(props) {
    super(props);

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: this.props.bobaShop,
      suggestions: []
    };
  }

  componentDidMount() {
    this.props.firebase.bobaShops().on('value', snapshot => {
      const bobaShopsObject = snapshot.val();
      if (bobaShopsObject) {
        const bobaShopsList = Object.keys(bobaShopsObject).map(key => ({
          name: key,
        }))
        bobaShops = bobaShopsList;
      }
    });
  }

  componentWillReceiveProps(props) {
    this.setState({ value: props.bobaShop });
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
    console.log("New input value:", newValue);
    this.props.getInputData(newValue);

  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  componentWillUnmount() {
    this.props.firebase.bobaShops().off();
  }


  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Enter shop name',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (

      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      //styling from theme.css   
      />
    );
  }
}

export default withFirebase(AutoSuggestBobaShops);
