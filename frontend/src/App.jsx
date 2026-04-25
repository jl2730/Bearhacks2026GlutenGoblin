import { useState, useRef } from 'react'
import './App.css'

export default function App() {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const file = inputRef.current.files[0]
    if (!file) return

    setLoading(true)
    setResult(null)
    setError(null)

    const formData = new FormData()
    formData.append('photo', file)

    try {
      const res = await fetch('/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
    } catch {
      setError('Network error — make sure the Flask server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>🛡️ Gluten Goblin</h1>
      <p className="subtitle">Snap a food label to check for gluten</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <label className="upload-btn" htmlFor="photo">
            📷 Take or Choose Photo
          </label>
          <input
            ref={inputRef}
            type="file"
            id="photo"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
          />
          {preview && (
            <img src={preview} className="preview" alt="Label preview" />
          )}
          <button type="submit" disabled={!preview || loading}>
            {loading ? 'Analyzing…' : 'Analyze Label'}
          </button>
        </form>
      </div>

      {error && (
        <div className="result-card">
          <p className="error">❌ {error}</p>
        </div>
      )}

      {result && (
        <div className="result-card">
          <div className="status-badge" style={{ color: result.color }}>
            {result.emoji} {result.status}
          </div>
          {result.messages.map((msg, i) => (
            <p key={i} className="message">{msg}</p>
          ))}
          <div className="breakdown">
            <p>OCR text found: {result.ocr_found ? 'Yes' : 'No'}</p>
            <p>Certification: {result.certification}</p>
            <p>GF claim on label: {result.gf_claim ? 'Yes' : 'No'}</p>
            <p>Shared facility warning: {result.facility_warning ? 'Yes' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  )
}
