# Metatext

Metatext is a google chrome extension that helps you contexualize what you are reading with real time news articles. 
For example, if you read "The proposal is a gambit by Meta to navigate European Union rules that threaten to restrict its ability to show users personalized ads" but you didn't know what European Union rules the article is talking about, then you could put in
"E.U. rules to restrict meta" into metatext and get the context behind the issue.

### Installation
1. To get started, ```git clone``` this repo.
2. cd into the root directory and run ```npm install```.
3. Add COHERE_API and METAPHOR_API keys to config.js
3. Run ```npm run build```
4. In Google Chrome, go to chrome://extensions
5. In the top right, if "Developer mode" is unchecked, check it
6. Click on "load unpacked" in the top left
7. Navigate to the dist folder and open it
8. You should now see the google chrome extension in your chrome.

### Usage
Metatext works best when giving it an issue. First, click on the google chrome extension in the top right and open the GUI.
In the text area, input your news headline/issue (i.e. antitrust case against Google). Next, click on contextuatlize and wait 
for the loader to finish. You will now see Summary and Sources. 