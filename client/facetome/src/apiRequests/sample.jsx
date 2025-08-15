import { useState } from "react"

const Login =({isLogin})=>{
return(
  <>
  {isLogin?
    <div>Logged in</div>
  :
    <div>Please Log In</div>
  }
  </>
)
} 

export default Login