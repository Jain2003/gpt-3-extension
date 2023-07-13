const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if(result['openai-key']) {
                const decodedKey = atob(result['openai-key'])
                resolve(decodedKey);
            }
        });
    });
}

const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0].id;

        chrome.tabs.sendMessage(
            activeTab,
            { message: 'inject', content },
            (response) => {
                if(response.status === 'failed'){
                    console.log('Failed to inject script');
                }
            }
        );
    });
};

const generate = async (info) => {
    const key = await getKey();
    const url = 'https://api.openai.com/v1/completions';

    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: info,
            max_tokens: 500,
            temperature: 0.7,
        }),
    });
    const completion = await completionResponse.json();
    console.log(completion);
    return completion.choices.pop();
}


const generateCompletionAction = async (info) => {
    try {
        sendMessage('generating ... ');
        const { selectionText } = info;
        const basePromptPrefix = `
        Write a LinkedIn post about the topic below in the most professional way possible along with proper hashtags at the end of the post :
        
        Title:
        `;

        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);
        sendMessage(baseCompletion.text);
    }catch(error) {
        sendMessage(error.toString());
    }
};


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'context-run',
        title: 'generate LinkedIn post',
        contexts: ['selection']
        // contexts : ['']
    });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);