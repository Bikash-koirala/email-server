import { Spin } from 'antd'
import React from 'react'

const Loader = () => {
  return <div style={{
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}><Spin size="large" /></div>
}

export default Loader