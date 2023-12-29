import React from 'react';
import { ConfigProvider } from 'antd';
import { openSans } from '@/app/layout';

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#000'
          }
        }}
      >
        {children}
      </ConfigProvider>
    </div>
  );
}

export default ThemeProvider;
