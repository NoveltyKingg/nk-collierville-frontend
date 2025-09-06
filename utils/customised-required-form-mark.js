import { Tag } from "antd";
import React from "react";

function CustomisedRequiredFormMark(label, { required }) {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <div>{label}</div>
      <div>
        {required ? (
          <Tag color="error">Required</Tag>
        ) : (
          <Tag color="warning">optional</Tag>
        )}
      </div>
    </div>
  );
}

export default CustomisedRequiredFormMark;
