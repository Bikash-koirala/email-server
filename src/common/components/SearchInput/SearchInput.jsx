import { Input } from "antd";
import React from "react";

export default function SearchInput({ onSearch }) {
  return (
    <>
      <div>
        <Input.Search
          className="search-input"
          placeholder="Search..."
          onSearch={onSearch}
          enterButton
          allowClear
          size="large"
          style={{ width: 500 }}
        />
      </div>
    </>
  );
}
