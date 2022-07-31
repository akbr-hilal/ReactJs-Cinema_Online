import React from 'react'

function NotFound() {
    const title = "Page Not Found"
    document.title = title
  return (
    <div>
        <h1 className="text-center">Page Not Found</h1>
    </div>
  )
}

export default NotFound