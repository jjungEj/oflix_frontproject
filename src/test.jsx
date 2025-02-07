import { useState } from 'react'

function Test() {
  const [data, setData] = useState(null)

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cinemas', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // response.json()을 사용하여 응답을 JSON 형식으로 처리
      const result = await response.json()
      console.log('Fetched data:', result)

      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
      setData(null) // 에러 발생 시 데이터 초기화
    }
  }

  return (
    <div>
      <h1>Cinema List</h1>
      <button onClick={handleClick}>영화관 목록 가져오기</button>

      {data && (
        <div>
          <h2>영화관 데이터:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Test
