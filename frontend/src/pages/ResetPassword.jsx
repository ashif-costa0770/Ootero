import React from 'react'
import ResetPasswordForm from '../components/form/ResetPasswordForm'
import RightSection from '../components/login/RightSection'

const ResetPassword = () => {
  return (
    <div className="flex min-h-screen">
    {/* Left — form side */}
    <div className="flex flex-col justify-center flex-1 bg-slate-50">
      <ResetPasswordForm />
    </div>

    {/* Right — your existing panel */}
    <RightSection />
  </div>
  )
}

export default ResetPassword