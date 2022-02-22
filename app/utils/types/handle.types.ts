import React from "react";

export type TFHandle<T> = {
  breadcrumb: (data: T) => string | React.ReactNode;
};
