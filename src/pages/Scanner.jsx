import { Html5QrcodeScanner } from "html5-qrcode"
import { useEffect, useState } from "react"
import * as Yup from "yup"

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null)
  const [formData, setFormData] = useState({
    rider: "",
    location: "",
    deliveryStatus: "",
  })
  const [formErrors, setFormErrors] = useState({
    rider: "",
    location: "",
    deliveryStatus: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    // Check if all form fields are filled before rendering the scanner
    const isFormFilled = Object.values(formData).every(
      (value) => value.trim() !== ""
    )
    setFormSubmitted(isFormFilled)
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Update form data
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    // Update form errors
    validateField(name, value)
  }

  const validateField = (rider, value) => {
    // Use Yup schema for validation
    const schema = Yup.object({
      rider: Yup.string().required("Name is required"),
      location: Yup.string().required("Location is required"),
      deliveryStatus: Yup.string().required("Delivery Status is required"),
    })

    // Validate the field and update errors
    schema
      .validateAt(rider, { [rider]: value })
      .then(() => {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [rider]: "",
        }))
      })
      .catch((error) => {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [rider]: error.message,
        }))
      })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    // Validate all fields before enabling the scanner
    const isFormValid = Object.keys(formData).every((field) => {
      validateField(field, formData[field])
      return formErrors[field] === ""
    })

    if (isFormValid) {
      // After form submission, enable the scanner
      setFormSubmitted(true)
    }
  }

  useEffect(() => {
    if (formSubmitted) {
      const scanner = new Html5QrcodeScanner("reader", {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      })

      scanner.render(success, error)

      function success(result) {
        scanner.clear()
        setScanResult(result)

        // Make a POST request to save the scanResult
        saveScanResult(result)
      }

      function error(err) {
        console.warn(err)
      }

      return () => {
        // Cleanup when the component unmounts
        scanner.clear()
      }
    }
  }, [formSubmitted])

  const saveScanResult = async (result) => {
    try {
      const response = await fetch("http://localhost:3002/items/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ scanResult: result, formData }),
        body: JSON.stringify({
          itemCode: 1233, // use result
          deliveryStatus: formData.deliveryStatus,
          location: formData.location,
          rider: formData.rider,
        }),
      })

      if (response.ok) {
        console.log("Scan result saved successfully")
      } else {
        console.error("Failed to save scan result")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600">
      <header className="text-center p-4 mt-10">
        <h1 className="text-3xl font-bold text-white">QR Code Scanning</h1>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        {scanResult ? (
          <div>
            <ul className="text-left list-none">
              <li className="flex justify-between">
                <h2>Item Code:</h2>
                <p className="text-white">{scanResult}</p>
              </li>
              <li className="flex justify-between">
                <h2>Rider Name:</h2>
                <p className="text-white">{formData.rider}</p>
              </li>
              <li className="flex justify-between">
                <h2>Location:</h2>
                <p className="text-white">{formData.location}</p>
              </li>
              <li className="flex justify-between">
                <h2>Delivery Status:</h2>
                <p className="text-white">{formData.deliveryStatus}</p>
              </li>
            </ul>

            <button
              type="submit"
              className="bg-white text-indigo-600 py-2 px-4 rounded font-bold "
              onClick={saveScanResult}
              disabled={!formSubmitted} // Disable the button until the form is submitted
            >
              Submit
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleFormSubmit} className="mt-4">
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">
                  Rider Name:
                </label>
                <input
                  type="text"
                  name="rider"
                  value={formData.rider}
                  onChange={handleInputChange}
                  className={`border rounded w-full py-2 px-3 ${
                    formErrors.rider ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.rider && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.rider}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">
                  Location:
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`border rounded w-full py-2 px-3 ${
                    formErrors.location ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.location}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-white text-sm font-bold mb-2">
                  Delivery Status:
                </label>
                <input
                  type="text"
                  name="deliveryStatus"
                  value={formData.deliveryStatus}
                  onChange={handleInputChange}
                  className={`border rounded w-full py-2 px-3 ${
                    formErrors.deliveryStatus ? "border-red-500" : ""
                  }`}
                  required
                />
                {formErrors.deliveryStatus && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.deliveryStatus}
                  </p>
                )}
              </div>
              {/* <button
                type="submit"
                className="bg-white text-indigo-600 py-2 px-4 rounded font-bold"
                disabled={!formSubmitted} // Disable the button until the form is submitted
              >
                Submit
              </button> */}
            </form>
            <div id="reader" className="mt-4">
              Fill all the fields to enable the scanner!
            </div>
          </>
        )}
      </main>
      <footer className="mt-auto text-white mb-5">
        <p className="text-sm">&copy; 2024 Duthaya. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Scanner
