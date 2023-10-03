import { METAPHOR_API, COHERE_API } from "./config";
import React, { useState } from 'react';
import './input.css';
import './loading.css';

const examples = [
  'antitrust case against Google',
  'TikTok scrutiny from U.S. authorities',
  'European Union rules that threaten to restrict meta'
]
const randomExample = Math.floor(Math.random() * 3)

function App() {
  const [results, setResults] = useState([])
  const [contents, setContents] = useState([])
  const [summary, setSummary] = useState(["empty"])
  const [radio, setRadio] = useState("summary")

  const Summarize = async (text : string) => {
    const headers = {
      "accept": "application/json",
      "content-type": "application/json",
      "authorization": "Bearer " + COHERE_API
    }
    const body = {
      "length": "medium",
      "format": "bullets",
      "model": "command",
      "text": text,
      "additional_command": "of this text"
    }
    await fetch('https://api.cohere.ai/v1/summarize', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })
    .then((response) => response.json())
    .then((response) => {
        if (response.summary === undefined) {
          return response;
        } else {
          const parsedResponse = response.summary.split("- ")
          setSummary(parsedResponse.slice(1))
          return response;
        }
    });
  }

  // const search = async () => {
  //   const searchArea = document.getElementById("search-area") as HTMLTextAreaElement | null;
  //   if (searchArea?.value === null || searchArea?.value === '') {
  //     return
  //   }
  //   const query = "here is a recent news article about " + (searchArea?.value || '') + ":";

  //   const url = 'https://corsproxy.io/?https://api.metaphor.systems/search';

  //   const requestData = {
  //     query: query,
  //     numResults: 1,
  //     useAutoprompt: true,
  //     type: 'neural'
  //   };

  //   const headers = {
  //     'x-api-key': METAPHOR_API,
  //     'Content-Type': 'application/json',
  //     "Access-Control-Allow-Origin": "*"
  //   };
  //   fetch(url, {
  //     method: 'POST',
  //     headers: headers,
  //     body: JSON.stringify(requestData)
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       setResults(data.results)
  //       const ids = data.results.map((result : any) => result.id)
  //       const dataIds = ids.join(',')
  //       const contentURL = `https://corsproxy.io/?https://api.metaphor.systems/contents?ids=${dataIds}`
  //       const fetchContent = async () => {
  //         fetch(contentURL, {
  //           method: 'GET',
  //           headers: headers,
  //         }).then(response => {
  //           if (!response.ok) {
  //             throw new Error('Network response was not ok');
  //           }
  //           return response.json();
  //         }).then(async data => {
  //           setContents(data.contents)
  //           const fullContent = data.contents.map((content : any) => content.extract.replace( /(<([^>]+)>)/ig, '')).join(' ')
  //           await Summarize(fullContent)
  //         })
  //       }
  //       fetchContent()
  //     })
  //     .catch(error => {
  //       console.error('Fetch error:', error);
  //     });
  // }

  const search = () => {
    setSummary(["loading"])
    setTimeout(() => {
      setSummary(
        ["TikTok has been in negotiations with the US government for months to resolve national security concerns and continue operating in the country.", 
        "A draft agreement has been reached, however the US Justice and Treasury Departments have raised concerns over the terms being too lenient.",
        "The deal would allow TikTok to continue operating without major changes to its ownership structure."
      ] as never[]
      )
    }, 1000)
  }


  return (
    <div className="App">
      <textarea maxLength={200} id="search-area" placeholder={`i.e. ${examples[randomExample]}`}></textarea>
      <button className="search-button" onClick={() => search()}>Contextualize</button>
      {/* <div>
        {
          results.map((result : any) => {
            return (
              <div key={result.id}>
                {result.title}
                {result.url}
              </div>
            )
          })
        }
      </div> */}
      { 
        summary[0] === "loading" ? (
          <div className="banter-loader">
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
          </div>
      ) : (
        <>
          {
            summary[0] === "empty" ? (
              <></>
            ) : (
            <>
              <div className="radio-inputs">
                <label className="radio" onClick={() => setRadio("summary")}>
                  <input type="radio" name="radio" checked={radio === "summary"} />
                  <span className="name">Summary</span>
                </label>
                <label className="radio" onClick={() => setRadio("sources")}>
                  <input type="radio" name="radio" checked={radio === "sources"} />
                  <span className="name">Sources</span>
                </label>
              </div>
              <div className="summary-container">
                <div style={{fontSize: 16}}>
                  {
                    summary?.map((item : any) => {
                      return (
                        <div key={item} style={{marginBottom:"4px"}}>
                          • {item}
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </>
            )
          }
        </>
      )
      }
    </div>
  );
}

export default App;