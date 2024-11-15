'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function Users() {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    axios
      .get("https://truewallet.onrender.com/api/v1/user/bulk?filter=" + filter)
      .then((response) => setUsers(response.data.users))
  }, [filter])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Recent Contacts</h1>
      <div className="mb-6">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <User user={user} key={user._id} />
        ))}
      </div>
    </div>
  )
}

function User({ user }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <div className="rounded-full h-12 w-12 bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl">
          {user.firstname.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {user.firstname} {user.lastname}
          </h2>
        </div>
      </div>
      <button
        onClick={() => {
          navigate("/send?id=" + user._id + "&name=" + user.firstname)
        }}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300"
      >
        Send Money
      </button>
    </div>
  )
}