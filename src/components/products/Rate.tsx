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
    <>
      {defaultValue ? (
        <AntdRate
          allowHalf
          disabled={disabled}
          style={style}
          defaultValue={defaultValue}
        />
      ) : (
        <span className='text-gray-500 text-xs'>No rating yet</span>
      )}
    </>
  );
}

export default Rate;
