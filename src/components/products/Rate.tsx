'use client';
import React from 'react';
import { Rate as AntdRate } from 'antd';

function Rate({
  defaultValue,
  disabled,
  style
}: {
  defaultValue: number;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <AntdRate
      allowHalf
      disabled={disabled}
      style={style}
      defaultValue={defaultValue}
    />
  );
}

export default Rate;
