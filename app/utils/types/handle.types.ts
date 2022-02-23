import React from "react";

export type TFHandle<T> = {
  breadcrumb?: (data: T) => string | React.ReactNode;
  actionButtons?: (data: T) => React.ReactNode;
};
