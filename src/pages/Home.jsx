import React, { useEffect, useState } from "react"
import axios from "axios"
import Spinner from "../components/Spinner"
import { Link } from "react-router-dom"
import { MdOutlineAddBox } from "react-icons/md"

const Home = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://localhost:3002/items")
      .then((response) => {
        setItems(response.data.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Item List</h1>
        <Link to="/items/create">
          <MdOutlineAddBox className="text-sky-800 text 4xl" />
        </Link>
        <Link to="/items/scanner">
          <h1 className="text-sky-800 text 4xl">Scan Code</h1>
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <table className="w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="border border-slat-600 rounded-md">No</th>
              <th className="border border-slat-600 rounded-md">Item Code</th>
              <th className="border border-slat-600 rounded-md">
                Delivery Status
              </th>
              <th className="border border-slat-600 rounded-md">Rider</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item._id} className="h-8">
                <td className="border border-slate-700 rounded-md text-center">
                  {index + 1}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {item.itemCode}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {item.deliveryStatus}
                </td>
                <td className="border border-slate-700 rounded-md text-center">
                  {item.rider}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Home
