import React from "react";
import PropTypes from "prop-types";
import Tippy from "@tippyjs/react";
import onClickOutside from "react-onclickoutside";

import MetricLine from "~/components/MetricLine";
import Bubble from "~/components/Bubble";
import Tooltip from "./Tooltip";

import { getGroupColorNew } from "~/utils/colors";
import sizes from "~/constants/sizes";

const propTypes = {
  data: PropTypes.array.isRequired,
  isDisparityChart: PropTypes.bool.isRequired,
  handleActiveGroup: PropTypes.func.isRequired,
  metric: PropTypes.string.isRequired,
  referenceGroup: PropTypes.string.isRequired,
  scaleBubbleSize: PropTypes.func.isRequired,
  scaleColor: PropTypes.func.isRequired,
  scalePosition: PropTypes.func.isRequired,
  scaleShape: PropTypes.func.isRequired,
  y: PropTypes.number.isRequired,
  activeGroup: PropTypes.string
};

function Row(props) {
  Row.handleClickOutside = () => {
    return props.handleActiveGroup(null, true);
  };
  console.log(props.scalePosition);
  return (
    <g
      height={sizes.ROW_HEIGHT}
    >
      <MetricLine
        y={props.y}
        metric={props.metric}
        lineStart={sizes.MARGIN.left}
        lineEnd={sizes.WIDTH - sizes.MARGIN.right}
      />
      {props.data.map((row) => {
        const groupName = row["attribute_value"];
        const groupColor = getGroupColorNew(
          groupName,
          props.activeGroup,
          props.scaleColor
        );
        const dataColSuffix = props.isDisparityChart ? "_disparity_scaled" : "";

        return (
          <g key={`aequitas-bubble-$45{props.metric}-${groupName}`}>
            <Tippy
              content={
                <Tooltip
                  data={row}
                  metric={props.metric}
                  isReferenceGroup={props.referenceGroup === groupName}
                  groupColor={props.scaleColor(groupName)}
                />
              }
              placement="right"
            >
              <g>
                <Bubble
                  x={props.scalePosition(row[`${props.metric}${dataColSuffix}`])}
                  y={props.y}
                  size={props.scaleBubbleSize(row["group_size"])}
                  color={groupColor}
                  centerShape={props.scaleShape(groupName)}
                  onClick={() => props.handleActiveGroup(groupName)}
                />
              </g>
            </Tippy>
          </g>
        );
      })}
    </g>
  );
}

const clickOutsideConfig = {
  handleClickOutside: () => Row.handleClickOutside
};

Row.propTypes = propTypes;

export default onClickOutside(Row, clickOutsideConfig);