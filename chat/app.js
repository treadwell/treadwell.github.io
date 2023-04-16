const startBtn = document.getElementById('start-btn')
const transcriptEl = document.getElementById('transcript')
const responseEl = document.getElementById('response')
const tokenEl = document.getElementById('token')
tokenEl.value = localStorage.getItem("token") || ""

startBtn.addEventListener('click', () => {
    startListening()
})

async function startListening() {
    const recognition = new webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.start()

    recognition.onresult = async (event) => {
        const speechResult = event.results[0][0].transcript;
        transcriptEl.textContent = `You said: ${speechResult}`;

        // Get the ChatGPT response
        const chatGPTResponse = await fetchChatGPTResponse(speechResult);
        responseEl.textContent = `ChatGPT: ${chatGPTResponse}`;

        // Speak the ChatGPT response
        speak(chatGPTResponse)
    }

    recognition.onerror = (event) => {
        console.error('Error recognizing speech:', event.error)
    }
}

async function fetchChatGPTResponse(query) {

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + tokenEl.value
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages : [{"role": "user", "content": query}],
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 1,
    }),
  });

  const data = await response.json()
  const answer = data.choices[0]["message"]["content"]
  return answer
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speechSynthesis.speak(speech);
}

function remember() {
  localStorage.setItem("token", tokenEl.value)
}