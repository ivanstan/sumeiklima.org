import * as React from "react";

const overlay = {
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.4)',
    position: 'fixed' as 'fixed',
    top: 0,
    zIndex: 100,
};

const modal = {
    width: 400,
    height: 200,
    opacity: 1,
    background: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    top: 200
};

export class Modal extends React.Component<any, any> {

    render = () => {
        return (
            <div style={overlay}>
                <div style={modal} className={"vertical-align horizontal-align"}>
                {this.props.children}
                </div>
            </div>
        );
    };

}
