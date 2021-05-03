import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

function Loader(props) {

  return (
    <CircularProgress style={{ margin: props.margin || "50px", color:"#0081B2" }} size={props.size}/>
  );
}

export default Loader;
