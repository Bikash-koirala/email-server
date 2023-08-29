import React, { useState } from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, List, Skeleton, Switch } from "antd";

export default function EmailSkeletonLoader() {
  const [isSkeletonLoading, setIsSkeletonLoading] = useState(true);

  return (
    <div>
      <div className="divide-gray-200 dark:divide-gray-800 divide-y">
        {[...Array(6)].map((_, i) => {
          return (
            <div className="p-3" key={i}>
              <Skeleton
                loading={isSkeletonLoading}
                active
                avatar
                paragraph={{ rows: 2 }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
