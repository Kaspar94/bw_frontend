import React from "react";

const Spinner = props => {
  if (props.loading)
    return (
      <div className="loader-wrapper">
        <div className="loader" />
        <div className="text">{props.text}</div>
      </div>
    );

  return <div />;
};

export default Spinner;
