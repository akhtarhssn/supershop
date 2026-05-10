import React from 'react'

type Props = {
  children: React.ReactNode
}

const VerifyEmailLayout = (props: Props) => {
  return (
    <div>
      {props.children}
    </div>
  )
}

export default VerifyEmailLayout