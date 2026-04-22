import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat';
import { useEffect } from 'react';


const Dashboard = () => {

  const { user } = useSelector(state => state.auth)

  const { initSocketConnection } = useChat()

  console.log(user);

  useEffect(()=>{
    initSocketConnection()
  },[])

  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard
