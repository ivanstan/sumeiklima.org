import * as React from "react";
import * as ReactDOM from "react-dom";

export class SideBarToggleButton extends React.Component<any, any> {
    render() {
        return ReactDOM.createPortal(
            <button className={'btn text-white d-lg-none'} onClick={this.props.onClick}>
                <i className="fa fa-cog" aria-hidden="true"/>
            </button>,
            document.getElementById('override-nav')
        );
    }
}
