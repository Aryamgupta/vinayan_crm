import React from 'react';
import { DatePicker, Space } from 'antd';
// import 'antd/dist/antd.css';

const DatePickerr = ({ value, onChange }) => (
  <Space direction="vertical ">
    <DatePicker
      value={value}
      onChange={(date, dateString) => onChange && onChange(date)}
      style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', height: "45px"}}
    />
  </Space>
);

export default DatePickerr;
