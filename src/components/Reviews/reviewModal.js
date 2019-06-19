import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick,false);
    }
    handleClick = (e) =>{
        console.log(e);
        if(this.node.contains(e.target)){
            return;
        }
      this.props.onClose();
    }

    render() {
        // Render nothing if the "show" prop is false
        if (!this.props.show) {
            return null;
        }

        // The gray background
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.1)',
            padding: 50
        };

        // The modal "window"
        const modalStyle = {
            backgroundColor: 'white',
            borderRadius: 5,
            maxWidth: 500,
            minHeight: 300,
            margin: '0 auto',
            padding: 30
        };

        return (
            <div style={backdropStyle}>
                <div style={modalStyle} ref={node => this.node = node}>
                    sdfsd
          {this.props.children}
                    <div className="footer">
                        <button onClick={this.props.onClose}>
                            Close
            </button>
                    </div>
                </div>
            </div>
        );
    }
}

// Modal.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   show: PropTypes.bool,
//   children: PropTypes.node
// };

export default Modal;