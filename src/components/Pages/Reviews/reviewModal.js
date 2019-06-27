import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: ""
        }

    }
    // componentWillMount() {
    //     document.addEventListener('mousedown', this.handleClick, false);
    // }
    // componentWillUnmount() {
    //     document.removeEventListener('mousedown', this.handleClick,false);
    // }
    // handleClick = (e) =>{
    //     console.log(e);
    //     if(this.node.contains(e.target)){
    //         return;
    //     }
    //   this.props.onClose();
    // }

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
            margin: '10% auto',
            padding: 30,
        };

        const parentContentStyle = {
            marginBottom: '10px'
        }

        const buttonStyle = {
            display: 'inline',
            marginRight: '6px'
        }

        const buttonsStyle = {
            paddingTop: '10px',
            float: 'right'
        }

        const shop = this.props.commentModal.shop;
        const uid = this.props.commentModal.uid;
        
        return (
            <div style={backdropStyle}>
                <div style={modalStyle}
                // ref={node => this.node = node}
                >
                    <div style={parentContentStyle}>
                        {this.props.children}
                    </div>
                    <div className="footer">
                        <textarea autoFocus={true} onChange={this.props.changeComment} name="comment" className='form-control' rows='3'></textarea>
                        <div style={buttonsStyle}>
                            <button style={buttonStyle} className='btn btn-info' onClick={this.props.onClose}>
                                Cancel
                            </button>
                            <button className='btn btn-success' onClick={() => this.props.submitComment(shop, uid)}>
                                Submit
                            </button>
                        </div>

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