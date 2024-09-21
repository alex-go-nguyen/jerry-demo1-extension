import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export function Home() {
  const navigate = useNavigate()
  const handleLogout = () => {
    chrome.storage.local
      .clear()
      .then(() => {
        navigate('/login')
      })
      .catch((e) => console.log(e))
  }
  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}
