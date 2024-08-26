import React, { HTMLAttributes } from 'react'

import { Header } from './Components/Header'
import { Footer } from './Components/Footer'

const Layout = ({children}: {children: React.ReactNode}) => {
  const options: HTMLAttributes<HTMLDivElement> = {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }
  return (
    <div {...options}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout