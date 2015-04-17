var React = require('react');

var Sticky = React.createClass({
  reset: function() {
    var html = document.documentElement;
    var body = document.body;
    var windowOffset = window.pageYOffset || (html.clientHeight ? html : body).scrollTop;

    this.elementOffset = this.getDOMNode().getBoundingClientRect().top + windowOffset;
  },

  handleResize: function() {
    this.props.onStickyStateChange( false );
    // set style with callback to reset once style rendered succesfully
    var self = this;
    this.setState({ style: {}, className: '' }, function () {
      self.reset();
      self.handleScroll();
    });        
  },

  handleScroll: function() {
    var wasSticky = this.isSticky;
    this.isSticky = window.pageYOffset > this.elementOffset;
    if (this.isSticky) {
      this.setState({
        style: this.props.stickyStyle,
        className: this.props.stickyClass
      });
    } else {
      this.setState({ style: {}, className: '' });
    }
    if (this.isSticky !== wasSticky) {
      this.props.onStickyStateChange(this.isSticky);
    }
  },

  getDefaultProps: function() {
    return {
      type: React.DOM.div,
      stickyClass: 'sticky',
      stickyStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      },
      onStickyStateChange: function () {}
    };
  },

  getInitialState: function() {
    return {
      style: {}
    };
  },

  componentDidMount: function() {
    this.reset();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },

  render: function() {
    return this.props.type({
      style: this.state.style,
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
