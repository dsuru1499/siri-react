import React, { Component, Fragment, useState } from "react";
import PropTypes from "prop-types";

import "./XmlView.scss";

let counter = 0;
let MAX = 100;

function Attribute(props) {
    const { node } = props;

    return (
        <span className="html-attribute">
            {" "}
            <span className="html-attribute-name">{node.name}</span>
            {"=\""}
            <span className="html-attribute-value">{node.value}</span>
            {"\""}
        </span>
    );
}

function Tag(props) {
    const { node, closed, empty } = props;

    let header = closed ? "</" + props.node.nodeName : "<" + props.node.nodeName;
    let body = [];
    let footer = empty ? "/>" : ">";
    if (!closed) {
        for (let i = 0; i < node.attributes.length; i++) {
            body.push(<Attribute node={node.attributes[i]} key={i} />);
        }
    }

    return (
        <span className="html-tag">
            {header}
            {body}
            {footer}
        </span>
    );
}

function CollapsibleCollapsed(props) {
    const { node, min, max } = props;

    let result = null;
    if (min !== undefined && max !== undefined) {
        let text = "[" + min + "..." + max + "]";
        result = (<span className="html-tag">{text}</span>);
    } else {
        result = (<Fragment><Tag node={node} closed={false} empty={false} />...<Tag node={node} closed={true} empty={false} /></Fragment>);
    }

    return (
        <span className="collapsed">{result}</span>
    );
}

function CollapsibleExpanded(props) {
    const { node, min, max } = props;

    let header = null;
    let body = [];
    let footer = null;


    if (min !== undefined && max !== undefined) {
        header = (<span className="html-tag">{"[" + min + "..." + max + "]"}</span>);

        let children = node.childNodes;
        for (let i = min; i < max; i++) {
            let child = children[i];
            let value = processNode(child)
            body.push(<Fragment key={i++}>{value}</Fragment>);
        }
    } else {
        header = (<Tag node={node} closed={false} empty={false}></Tag>);

        let children = node.childNodes;
        if (children.length < MAX) {
            let i = 0;
            for (let child = node.firstChild; child; child = child.nextSibling) {
                let value = processNode(child);
                body.push(<Fragment key={i++}>{value}</Fragment>);
            }
        } else {
            let n = Math.ceil(children.length / MAX);
            for (let i = 0; i < n; i++) {
                let min = i * MAX;
                let max = Math.min(children.length, (i + 1) * MAX - 1);

                let collapsed = <CollapsibleCollapsed node={node} min={min} max={max} />;
                let expanded = <CollapsibleExpanded node={node} min={min} max={max} />;

                body.push(<Fragment key={i}><Collapsible collapsed={collapsed} expanded={expanded} /></Fragment>);
            }
        }
        footer = (<Line><Tag node={node} closed={true} empty={false}></Tag></Line>);
    }

    return (
        <span className="expanded">
            {header}
            <div className="collapsible-content">{body}</div>
            {footer}
        </span>
    );
}

function Collapsible(props) {
    const { collapsed, expanded } = props;
    const [opened, open] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        open(!opened);
    }

    return (
        <div className="collapsible" id={" collapsible-" + counter++}  >
            {!opened ? <Line><ExpandButton onClick={handleClick} />{collapsed}</Line>
                : <Line ><CollapseButton onClick={handleClick} />{expanded}</Line>}
        </div >
    );
}

function CollapseButton(props) {
    const { onClick } = props;
    const handleOnMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    return (<span className="button collapse-button" onMouseDown={handleOnMouseDown} onClick={onClick} />);
}

function ExpandButton(props) {
    const { onClick } = props;
    const handleOnMouseDown = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    return (<span className="button expand-button" onMouseDown={handleOnMouseDown} onClick={onClick} />);
}

function Comment(props) {
    return (<span className="html-comment">{props.children}</span>);
}

function Text(props) {
    return (<span className="text">{props.children}</span>);
}

function Line(props) {
    return (<div className="line"> {props.children} </div>);
}

function processNode(node) {
    let result = null;

    // console.log("process %o", node);
    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            result = processElement(node);
            break;
        case Node.TEXT_NODE:
            result = processText(node);
            break;
        case Node.CDATA_SECTION_NODE:
            result = processCDATA(node);
            break;
        case Node.PROCESSING_INSTRUCTION_NODE:
            result = processProcessingInstruction(node);
            break;
        case Node.COMMENT_NODE:
            result = processComment(node);
            break;
        default:
            break;
    }
    return result;
}

function processElement(node) {
    let result = null;

    if (!node.firstChild)
        result = processEmptyElement(node);
    else {
        let child = node.firstChild;
        if (child.nodeType === Node.TEXT_NODE && isShort(child.nodeValue) && !child.nextSibling)
            result = processShortTextOnlyElement(node);
        else
            result = processComplexElement(node);
    }
    return result;

}

function processText(node) {
    return (<Text>{node.nodeValue}</Text>);
}

function processCDATA(node) {
    const begin = "<![CDATA[ ";
    const trailing = "...";
    const end = " ]]>";

    if (isShort(node.nodeValue)) {
        let text = begin + node.tagName + " " + node.nodeValue + end;
        return (<Line><Comment>{text}</Comment></Line>);
    } else {
        let text = begin + node.tagName + " ";
        const collapsed = <Comment><Text>{text}</Text><Text>{trailing}</Text><Text>{end}</Text></Comment>;
        const expanded = <Comment><Text>{text}</Text><Text>{node.nodeValue}</Text><Text>{end}</Text></Comment>;
        return (<Collapsible collapsed={collapsed} expanded={expanded} />);
    }
}

function processProcessingInstruction(node) {
    const begin = "<?";
    const trailing = "...";
    const end = " ?>";

    if (isShort(node.nodeValue)) {
        let text = begin + node.tagName + " " + node.nodeValue + end;
        return (<Line><Comment>{text}</Comment></Line>);
    } else {
        let text = begin + node.tagName + " ";
        const collapsed = <Comment><Text>{text}</Text><Text>{trailing}</Text><Text>{end}</Text></Comment>;
        const expanded = <Comment><Text>{text}</Text><Text>{node.nodeValue}</Text><Text>{end}</Text></Comment>;
        return (<Collapsible collapsed={collapsed} expanded={expanded} />);
    }
}

function processComment(node) {
    const begin = "<!-- ";
    const trailing = "...";
    const end = " -->";

    if (isShort(node.nodeValue)) {
        let text = begin + node.tagName + " " + node.nodeValue + end;
        return (<Line><Comment>{text}</Comment></Line>);
    } else {
        let text = begin + node.tagName + " ";
        const collapsed = <Comment><Text>{text}</Text><Text>{trailing}</Text><Text>{end}</Text></Comment>;
        const expanded = <Comment><Text>{text}</Text><Text>{node.nodeValue}</Text><Text>{end}</Text></Comment>;
        return (<Collapsible collapsed={collapsed} expanded={expanded} />);
    }
}

function processEmptyElement(node) {
    return (<Line><Tag node={node} closed={false} empty={true} /></Line>);
}

function processShortTextOnlyElement(node) {

    const values = [];
    let i = 0;
    for (let child = node.firstChild; child; child = child.nextSibling) {
        values.push(<Text key={i}>{child.nodeValue}</Text>);
    }

    return (
        <Line>
            <Tag node={node} closed={false} empty={false} />
            {values}
            <Tag node={node} closed={true} empty={false} />
        </Line>
    );
}

function processComplexElement(node) {
    {
        let collapsed = <CollapsibleCollapsed node={node} />;
        let expanded = <CollapsibleExpanded node={node} />;

        return (<Collapsible collapsed={collapsed} expanded={expanded} />);
    }
}

function trim(value) {
    return value.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
}

function isShort(value) {
    return trim(value).length <= 80;
}

function isEmpty(o) {
    return (o === undefined || o === null || (Object.keys(o).length === 0 && o.constructor === Object));
}

export default class XmlView extends Component {
    constructor(props) {
        super(props);
        MAX = props.length;
    }

    static propTypes = {
        length: PropTypes.number,
        document: PropTypes.object,
    };

    static defaultProps = {
        length: 100,
    };

    render() {
        const { document } = this.props;

        let result = [];
        let i = 0;
        if (!isEmpty(document)) {
            for (let child = document.firstChild; child; child = child.nextSibling) {
                let value = processNode(child)
                result.push(<Fragment key={i++}>{value}</Fragment>);
            }
        }

        return (
            <div className="pretty-print" >
                {result}
            </div>
        );
    }
}