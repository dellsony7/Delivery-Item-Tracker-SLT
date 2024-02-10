import React, { useState } from "react"
import { BackButton } from "../components/BackButton"
import Spinner from "../components/Spinner"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const CreateItems = () => {
  const [itemCode, setItemCode] = useState()
  const [deliveryStatus, setDeliveryStatus] = useState()
  const [rider, setRider] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    setLoading(true)
    axios
      .get(`http://localhost:3002/items/${id}`)
      .then((response) => {
        setItemCode(response.data.itemCode)
        setDeliveryStatus(response.data.deliveryStatus)
        setRider(response.data.rider)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        alert("An error happened: Please check console")
        console.log(error)
      })
  })

  const handleSaveItem = () => {
    const data = {
      rider,
      deliveryStatus,
      itemCode,
    }
    setLoading(true)
    axios
      .post("http://localhost:3002/items", data)

      .then(() => {
        setLoading(false)
        navigate("/")
      })
      .catch((error) => {
        setLoading(false)
        alert("An error happened. Please check console")
        console.log(error)
      })
  }

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Add New Item</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Rider</label>
          <input
            type="text"
            value={rider}
            onChange={(e) => setRider(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Delivery Status</label>
          <select
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          >
            <option value="">Select an option</option>
            <option value="Picked-up from SLT">Picked-up from SLT</option>
            <option value="Delivered to Kubiyo">Delivered to Kubiyo</option>
            <option value="Picked-up from Kubiyo">Picked-up from Kubiyo</option>
            <option value="Delivered to Client">Delivered to Client</option>
          </select>
        </div>

        {/* <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => SetLocation(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div> */}
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Item Code</label>
          <input
            type="text"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <button className="p-2 bg-sky-300 m-8" onClick={handleSaveItem}>
          Save
        </button>
      </div>
    </div>
  )
}

export default CreateItems
