import { userService } from '@/services/user.service'

export const getCurrentUser = async () => {
  const response = await chrome.storage.local.get('currentUser')
  if (response) {
    return response.currentUser
  } else {
    return await userService.getCurrentUser()
  }
}
